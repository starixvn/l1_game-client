import { payChips, playWinningEffect } from "../../_base/action/PayChipsAction";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import FruitSlotChoices from "../event-models/FruitSlotChoices";
import { FruitSlotResult, FruitSlotSettlementResult } from "../FruitSlotType";
import FruitSlot from "../view-models/FruitSlot";

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
                game.gameData.settlement.finishShowResult(finish, true);
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
        // game.betOptionsUI.spinItems[settlement.result.symbolPositions[0]].highlight.opacity = 255;

        const finish = game.finishHandler as GameBaseFinishHandler;
        payChips(game, transformSettlementResult(settlement.settlementResult), settlement.winningPlayers, 1.2, 3);
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
