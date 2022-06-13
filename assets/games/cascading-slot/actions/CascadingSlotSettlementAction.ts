import GameUtils from "../../../common/GameUtils";
import { CascadingSlotFinishData, WinIconDetail } from "../models/CascadingSlotFinishModel";
import { CascadingSlotState } from "../models/CascadingSlotStateModel";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { convertBoardValue, convertData } from "../view-models/CascadingSlotUtils";
import { CascadingSlotGameSound } from "../../_slotgame_base/SlotGameSound";

export const handleSettle = (mainGame: CascadingSlotBase) => async (data: CascadingSlotFinishData) => {
    const { win, bigWin, roundId, totalFreeSpins, freeSpins, isFreeSpin, multiplier, totalMultiplier } = data;
    const tumbles = data.tumbles;
    mainGame.gameData.stateModel.change(CascadingSlotState.Spinning);
    mainGame.showProcessingWarning(false);

    mainGame.setGameRound(roundId);

    const isTurbo = mainGame.isTurboMode();

    const result = convertData(data.result);
    const multipliers = tumbles[0].multipliers;
    let multiplierCount = multipliers.length;
    let countIconPerRound = 0;
    const getMultiplier = multiplierCount > 0;
    !mainGame.board.boardSound && (mainGame.board.boardSound = mainGame.gameSound);
    await mainGame.board.spinResult(result, multipliers, isTurbo);

    if (getMultiplier) {
        mainGame.gameData.uiModel.getMultiplier();
    }

    for (let i = 0; i < tumbles.length - 1; i++) {
        const tumble = tumbles[i];
        const { icons, win: tumbleWin, settlement } = tumble;

        const newTumbleMultipliers = [...tumbles[i + 1].multipliers];
        const getMoreMultiplier = newTumbleMultipliers.length > multiplierCount;
        if (getMoreMultiplier) {
            multiplierCount = newTumbleMultipliers.length;
        }
        const tumbleMultipliers = newTumbleMultipliers;
        const explode = convertBoardValue(settlement.explode);
        const newItems = convertBoardValue(settlement.new);

        if (tumbleWin > 0) {
            Object.keys(icons).forEach((iconKey) => {
                const winIconDetail: WinIconDetail = icons[iconKey];
                const node = mainGame.board.getRandomWinItem(explode, +iconKey);
                const position = mainGame.effectContainer.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.v3(0, 0)));
                mainGame.createFlyWinLabel(mainGame.effectContainer, position, winIconDetail.win);
            });
            mainGame.gameData.uiModel.increaseTumbleWin(tumbleWin);
        }

        mainGame.gameData.uiModel.getTumble();
        await mainGame.board.removeItems(explode);
        countIconPerRound = mainGame.tumbleList.addIcons(icons, countIconPerRound);
        mainGame.board.addItems(newItems);
        const multiplierItems = mainGame.board.getMultiplierItems();
        multiplierItems.forEach((multiplierItem, index) => multiplierItem.setValue(tumbleMultipliers[index]));
        await mainGame.board.fallIn(isTurbo);
        if (getMoreMultiplier) {
            mainGame.gameData.uiModel.getMultiplier();
        }
    }

    await handleMultiplier(mainGame, isFreeSpin, totalMultiplier, multiplier, win);

    if (bigWin) {
        await mainGame.showEffectBigWin(data.win);
    }

    if (freeSpins > 0) {
        await mainGame.showEffectFreeSpins(freeSpins);
    }
    mainGame.gameData.uiModel.setFreeSpins(totalFreeSpins);

    mainGame.gameData.stateModel.change(CascadingSlotState.Settled);

    const delayForNextSpin = mainGame.getCustomDuration("delayForNextSpin");
    await GameUtils.delayTime(delayForNextSpin);
    handleAutoSpin(mainGame);
};

const handleAutoSpin = (mainGame: CascadingSlotBase) => {
    if (!mainGame.showNoticeForCacheApiError()) {
        const isAutoSpinMode = mainGame.isAutoSpinMode();
        const stillAutoSpin = mainGame.stillAutoSpin();
        const autoSpin = isAutoSpinMode && stillAutoSpin;
        if (autoSpin || mainGame.isFreeSpin()) {
            mainGame.spin();
        } else if (isAutoSpinMode && !stillAutoSpin) {
            mainGame.createAutoSpinDialog();
        } else {
            mainGame.onAutoSpinOff();
        }
    } else {
        mainGame.onAutoSpinOff();
    }
};

const handleMultiplier = async (
    mainGame: CascadingSlotBase,
    isFreeSpin: boolean,
    totalMultiplier: number,
    multiplier: number,
    win: number
) => {
    const currentTotalMultiplier = mainGame.gameData.uiModel.totalMultiplier;
    const winMultiplier = multiplier > 0 && win > 0;
    const needMoveTotalMultiplier = isFreeSpin && winMultiplier && currentTotalMultiplier > 0;

    if (needMoveTotalMultiplier) {
        await mainGame.tumbleWinView.shiftRightTumbleWin(currentTotalMultiplier);
        await movingMultiplier(mainGame.totalMultiplierView.total.node, mainGame.effectContainer, mainGame.tumbleWinView.multiplier.node);
        mainGame.gameData.uiModel.increaseMultiplier(currentTotalMultiplier);
    }

    if (winMultiplier) {
        const multiplierItems = mainGame.board.getMultiplierItems();
        for (const mItem of multiplierItems) {
            mainGame.gameSound.playSound(CascadingSlotGameSound.MULTIPLIER_SYMBOL_APPEAR);
            await mItem.playAnimationGlow();
            await mainGame.tumbleWinView.shiftRightTumbleWin(mItem.multiplier);
            await movingMultiplier(mItem.value.node, mainGame.effectContainer, mainGame.tumbleWinView.multiplier.node);
            mainGame.gameData.uiModel.increaseMultiplier(mItem.multiplier);
        }

        await GameUtils.delayTime(mainGame.tumbleWinView.mulitiplierEffectDuration);
    }

    if (win > 0) {
        await mainGame.tumbleWinView.setTotalWinValue(win);
        mainGame.gameData.uiModel.setTotalWin(win);
    }

    if (mainGame.isTrialMode) {
        mainGame.gameData.trialModel.updateSettledBalance();
    } else {
        mainGame.updateUserBalance();
    }

    if (winMultiplier && isFreeSpin) {
        await movingMultiplier(mainGame.tumbleWinView.multiplier.node, mainGame.effectContainer, mainGame.totalMultiplierView.total.node);
    }
    mainGame.gameData.uiModel.changeTotalMultiplier(totalMultiplier);
};

const movingMultiplier = (multiplierNode: cc.Node, container: cc.Node, destNode: cc.Node) => {
    return new Promise<void>((resolve) => {
        const node = cc.instantiate(multiplierNode);
        node.active = true;
        const startPos = container.convertToNodeSpaceAR(multiplierNode.convertToWorldSpaceAR(cc.v3(0)));
        const destPos = container.convertToNodeSpaceAR(destNode.convertToWorldSpaceAR(cc.v3(0)));
        container.addChild(node);
        node.position = startPos;

        const distance = startPos.sub(destPos).mag();
        const pixelPerSecond = 750;
        const duration = distance / pixelPerSecond;
        cc.tween(node)
            .to(duration * 0.3, { scale: 1.5 }, { easing: "sineOut" })
            .to(duration * 0.69, { scale: 1 }, { easing: "sineIn" })
            .start();
        cc.tween(node)
            .to(duration, { position: destPos }, { easing: "sineOut" })
            .call(() => {
                resolve();
                node.destroy();
            })
            .start();
    });
};
