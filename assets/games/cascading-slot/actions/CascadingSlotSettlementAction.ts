import { CascadingSlotFinishData, WinIconDetail } from "../models/CascadingSlotFinishModel";
import { CascadingSlotState } from "../models/CascadingSlotStateModel";
import { SpinButtonState } from "../models/SpinButtonStateModel";
import CascadingSlotBase from "../view-models/CascadingSlotBase";
import { convertBoardValue, convertData } from "../view-models/CascadingSlotUtils";

export const handleSettle = (mainGame: CascadingSlotBase) => async (data: CascadingSlotFinishData) => {
    const { win, bigWin, roundId, totalFreeSpins, freeSpins, isFreeSpin, multiplier, totalMultiplier, tumbles } = data;
    mainGame.gameData.stateModel.change(CascadingSlotState.Spinning);
    mainGame.showProcessingWarning(false);

    mainGame.processingSettlement = true;
    mainGame.setGameRound(roundId);

    const isTurbo = mainGame.isTurboMode();

    const result = convertData(data.result);
    const multipliers = tumbles[0].multipliers;
    await mainGame.board.spinResult(result, multipliers, isTurbo);

    let i = 0;
    while (i < tumbles.length - 1) {
        const tumble = tumbles[i];
        const { icons, win: tumbleWin, settlement } = tumble;
        const tumbleMultipliers = [...tumbles[i + 1].multipliers];
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
            mainGame.gameData.uiModel.increaseTotalWin(tumbleWin);
        }

        await mainGame.board.removeItems(explode);
        mainGame.tumbleList.addIcons(icons);
        mainGame.board.addItems(newItems);
        const multiplierItems = mainGame.board.getMultiplierItems();
        multiplierItems.forEach((multiplierItem, index) => multiplierItem.setValue(tumbleMultipliers[index]));
        await mainGame.board.fallIn();

        i++;
    }

    if (isFreeSpin) {
        const currentTotalMultiplier = mainGame.gameData.uiModel.totalMultiplier;
        if (currentTotalMultiplier > 0) {
            await movingMultiplier(
                mainGame.totalMultiplierView.total.node,
                mainGame.effectContainer,
                mainGame.tumbleWinView.multiplier.node
            );
            mainGame.gameData.uiModel.increaseMultiplier(currentTotalMultiplier);
        }
    }

    if (multiplier > 0 && win > 0) {
        const multiplierItems = mainGame.board.getMultiplierItems();
        for (const mItem of multiplierItems) {
            mItem.hideMultiplier();
            await movingMultiplier(mItem.value.node, mainGame.effectContainer, mainGame.tumbleWinView.multiplier.node);
            mainGame.gameData.uiModel.increaseMultiplier(mItem.multiplier);
        }

        mainGame.gameData.uiModel.setTotalWin(win);

        if (isFreeSpin) {
            await movingMultiplier(
                mainGame.tumbleWinView.multiplier.node,
                mainGame.effectContainer,
                mainGame.totalMultiplierView.total.node
            );
            mainGame.gameData.uiModel.changeTotalMultiplier(totalMultiplier);
        }
    }

    if (bigWin) {
        await mainGame.showEffectBigWin(data.win);
    }

    if (freeSpins > 0) {
        await mainGame.showEffectFreeSpins(freeSpins);
    }

    mainGame.gameData.uiModel.setFreeSpins(totalFreeSpins);

    mainGame.processingSettlement = false;
    mainGame.gameData.stateModel.change(CascadingSlotState.Settled);
    if (!mainGame.showNoticeForCacheApiError()) {
        if ((mainGame.isAutoSpinMode() && mainGame.stillAutoSpin()) || mainGame.isFreeSpin()) {
            mainGame.spin();
        } else {
            mainGame.gameData.spinButtonStateModel.change(SpinButtonState.Normal);
        }
    }
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
        const pixelPerSecond = 500;
        const duration = distance / pixelPerSecond;
        cc.tween(node)
            .to(duration, { position: destPos }, { easing: "sineOut" })
            .call(() => {
                resolve();
                node.destroy();
            })
            .start();
        cc.tween(node)
            .to(duration * 0.5, { scale: 1.1 })
            .to(duration * 0.5, { scale: 1 })
            .start();
    });
};
