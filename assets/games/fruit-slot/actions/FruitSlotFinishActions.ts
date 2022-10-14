import { getLowercaseObjectKeys } from "../../../common/helpers/ObjectHelper";
import { dealerGetChips, dealerPayChips, payChips, playWinningEffect } from "../../_base/action/PayChipsAction";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import { Durations } from "../../_new/_base/game-data-management/models/durations";
import FruitSlotChoices from "../event-models/FruitSlotChoices";
import { FruitSlotResult, FruitSlotSettlementResult } from "../FruitSlotType";
import FruitSlot from "../view-models/FruitSlot";
import { lodash as _ } from "../../../ClientModules";
import WebSocketTableGameBase from "../../_base/WebSocketTableGameBase";
import BetItem from "../../_base/view-models/BetItem";
import GameUtils from "../../../common/GameUtils";

const duraionPayChips = 1.2;
const duraionWinning = 3;
const nameChipStack = "chipStackNode";

export type FruitSlotFinishModel = {
    result: FruitSlotResult;
    settlementResult: FruitSlotSettlementResult;
    winningPlayers: any[];
    roundId: number;
};

export const handleShowResult = (game: FruitSlot) => (finish: FruitSlotFinishModel) => {
    game.timeAnimShowResult(true);
    game.finishShowResult = false;
    const delaySpinAnim = 6.5;
    const isLucky = finish.result.isLucky;
    const payChipFlyTime = 1.2;

    game.setBgVisibility(game.betOptionsUI.bgLockSpin, false);
    game.betOptionsUI.lightAnimation.node.active = false;

    if (!isLucky) {
        cc.tween(game.spinItems)
            .call(() => {
                game.betOptionsUI.spinItemAnimation(finish);
                game.betOptionsUI.playLedLightAnimation();
                game.betOptionsUI.randomNumberAnimation();
            })
            .delay(delaySpinAnim)
            .call(() => {
                game.gameData?.settlement.finishShowResult(finish, true);
                game.betOptionsUI.bigSmallResult.string =
                    finish.result.bigSmall.value < 10
                        ? "0" + finish.result.bigSmall.value.toString()
                        : finish.result.bigSmall.value.toString();
            })
            .delay(0.5)
            .call(() => showSettlementResult(finish))
            .start();
    }
};

export const handleAfterSettlementResult =
    (game: FruitSlot) =>
    ({ settlement }: { settlement: FruitSlotFinishModel }) => {
        game.finishShowResult = true;
        game.timeAnimShowResult(false);
        game.statistic.addItem(settlement);
        game.miniRoundHistory.addNewItem(settlement);
        game.betOptionsUI.ledLightAnimation.active = false;
        game.betOptionsUI.highlightWinningChoice(settlement);
        game.gameData.betModel.ownBets = {};
        game.gameData.totalBetAmount = new FruitSlotChoices();

        const finish = game.finishHandler as GameBaseFinishHandler;
        payChips(game, transformSettlementResult(settlement.settlementResult), settlement.winningPlayers, 1.2, 3, true);
    };

const transformSettlementResult = (settlementResult: FruitSlotSettlementResult) => {
    return {
        bar: settlementResult.bar || settlementResult.bar25 || settlementResult.bar50,
        tripleSeven: settlementResult.tripleSeven || settlementResult.tripleSeven3,
        star: settlementResult.star || settlementResult.star3,
        watermelon: settlementResult.watermelon || settlementResult.watermelon3,
        bell: settlementResult.bell || settlementResult.bell3,
        lemon: settlementResult.lemon || settlementResult.lemon3,
        orange: settlementResult.orange || settlementResult.orange3,
        cherry: settlementResult.cherry || settlementResult.cherry3,
        big: settlementResult.big,
        small: settlementResult.small
    };
};

const showSettlementResult = (finish: FruitSlotFinishModel) => {
    const winChoice = finish;
    console.log("showSettlementResult", winChoice);
};

const showResult = (main: FruitSlot, resultData: any, isAnimated = true) => {
    const keys = getLowercaseObjectKeys(resultData);
    _.forEach(main.betItems, (item) => item.setHighlight(resultData[keys[item.node.name.toLowerCase()]], isAnimated));
    console.log("showResult BaccaratFinishHandler");
};

const payChipToLoginUser = (game: FruitSlot) => {
    const data = game.statusHandler.currentStatusData;
    if (!data || !data.win) {
        return;
    }

    const playerNode = game.userProfile.node;
    game.showWinningBet(data.bet);
    playWinningEffect(game, playerNode);
    game.updateUserBalance();
};

export const handleFirstLoadRoundHistory = (game: FruitSlot) => (roundHistory) => {
    if (roundHistory.length === 0) {
        return;
    }
    console.log("handleFirstLoadRoundHistory", game.gameData.durations.isWaiting());

    if (game.gameData.durations.isWaiting() || game.gameData.durations.isBeingSpecificPhase(Durations.Events.SHOW_ANIMATION)) {
        const settlement = roundHistory[0];
        if (settlement) {
            game.gameData.settlement.finishShowResult(settlement, false);
        }
        console.log("handleFirstLoadRoundHistory iswaiting", game.gameData.durations.isWaiting());
    }
};

const testPayChip = (main: FruitSlot, settlementResult: any, winningPlayers: any[]) => {
    const mainRoomGame = main as WebSocketTableGameBase;
    const settlementResultKeys = getLowercaseObjectKeys(settlementResult);
    const lostBetItems = _.filter(main.betItems, (item) => !settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);
    const winBetItems = _.filter(main.betItems, (item) => !!settlementResult[settlementResultKeys[item.node.name.toLowerCase()]]);
    main.node.runAction(
        cc.sequence(
            cc.delayTime(main.betChips.chipDelayFlyingTime),
            cc.callFunc(() => dealerGetChips(mainRoomGame, lostBetItems)),
            cc.delayTime(main.betChips.chipDelayFlyingTime),
            cc.callFunc(() => dealerPayChips(mainRoomGame, winBetItems)),
            cc.delayTime(main.betChips.chipDelayFlyingTime),
            cc.callFunc(() => {
                _.forEach(winBetItems, (item) => {
                    const chipStack = item.chipNode.getChildByName(nameChipStack);
                    item.chipNode.removeChild();
                    chipStack && item.chipNode.removeChild(chipStack);
                    chipStack?.destroy();
                });
                testPayChipToAllPlayers(mainRoomGame, winBetItems, winningPlayers);
            })
        )
    );
};

const testPayChipToAllPlayers = (mainRoomGame: WebSocketTableGameBase, winBetItems: BetItem[], winningPlayers) => {
    testPayChipsToLoginPlayer(mainRoomGame, mainRoomGame.statusHandler.currentStatusData, winBetItems, mainRoomGame.otherPlayers !== null);
    if (mainRoomGame.otherPlayers) {
        testPayChipsToOtherPlayers(mainRoomGame, winBetItems);
    }

    testPayChipsToInGamePlayers(winningPlayers, mainRoomGame, winBetItems);
};

const testPayChipsToLoginPlayer = (mainRoomGame: WebSocketTableGameBase, statusData, winBetItems: BetItem[], isOtherPlayers = true) => {
    if (!statusData || !statusData.win) {
        return;
    }

    testMoveChipPlayers(mainRoomGame, statusData, winBetItems, isOtherPlayers);

    mainRoomGame.showWinningBet(statusData.bet);
    const playerNode = mainRoomGame.userProfile?.userAvatar?.node?.parent;
    playerNode && playWinningEffect(mainRoomGame, playerNode);
    mainRoomGame.updateUserBalance();
};

const testMoveChipPlayers = (mainRoomGame: any, statusData, winBetItems: BetItem[], isOtherPlayers = true) => {
    const betItems = statusData.winningByChoices;
    if (isOtherPlayers) {
        testMoveChipWithRandomAmountToLoginPlayer(winBetItems, betItems, mainRoomGame);
    } else {
        testMoveChipWithAmountToLoginPlayer(winBetItems, betItems, mainRoomGame);
    }
};

const testMoveChipWithRandomAmountToLoginPlayer = (winBetItems: BetItem[], betItems, mainRoomGame: any) => {
    const destNode = mainRoomGame?.userProfile?.userAvatar?.node;
    if (!destNode) {
        return;
    }
    _.forEach(winBetItems, (item) => {
        if (betItems[item.node.name.toLowerCase()]) {
            mainRoomGame.betChips.moveChipsWithRandomAmount(item.chipNode.children[0], destNode, duraionPayChips);
        }
    });
};

const testMoveChipWithAmountToLoginPlayer = (winBetItems: BetItem[], betItems, mainRoomGame: any) => {
    const destNode = mainRoomGame?.userProfile?.userAvatar?.node;
    if (!destNode) {
        return;
    }
    const betItemLowercaseObjectKeys = getLowercaseObjectKeys(betItems);
    _.forEach(winBetItems, (item) => {
        if (betItems[betItemLowercaseObjectKeys[item.node.name.toLowerCase()]]) {
            mainRoomGame.betChips.moveChips(item.chipNode.children[0], destNode);
        }
    });
};

export const testPayChipsToOtherPlayers = (roomGame: any, winBetItems: BetItem[]) => {
    if (!roomGame.otherPlayers) {
        return;
    }

    _.forEach(winBetItems, (item) => {
        roomGame.betChips.moveChips(item.chipNode.children[0], roomGame.otherPlayers);
    });
};

const testPayChipsToInGamePlayers = (winningPlayers: any, mainRoomGame: any, winBetItems: BetItem[]) => {
    if (!winningPlayers) {
        return;
    }

    const winningPlayerIds = Object.keys(winningPlayers);

    _.forEach(winningPlayerIds, (playerId) => {
        const winningPlayerData = winningPlayers[playerId];
        const playerSlot = mainRoomGame.playerHandler.getPlayerSlot(playerId);
        const playerBetItems = winningPlayerData.winningByChoices;
        const bet = winningPlayerData.bet;

        if (playerSlot) {
            _.forEach(winBetItems, (item) => {
                if (playerBetItems && playerBetItems[item.node.name.toLowerCase()] > 0) {
                    mainRoomGame.betChips.moveChipsWithRandomAmount(item.chipNode.children[0], playerSlot.avatar.node, duraionPayChips);
                }
            });

            playerSlot.increaseBalance(winningPlayerData.bet);
            const convertValue = GameUtils.getValueByCurrency(bet, winningPlayerData.rate || 1);
            GameUtils.addFlyingText(playerSlot.node, true, convertValue, duraionWinning, 0, 10);
            playWinningEffect(mainRoomGame, playerSlot.node);
        }
    });
};
