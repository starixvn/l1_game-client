import { FruitSlotResult, FruitSlotSettlementResult } from "../FruitSlotType";
import FruitSlot from "../view-models/FruitSlot";
import FruitSlotBetItem from "../view-models/FruitSlotBetItem";

export type FruitSlotFinishModel = {
    result: FruitSlotResult;
    settlementResult: FruitSlotSettlementResult;
    winningPlayers: any[];
    roundId: number;
};

export const handleShowResult = (game: FruitSlot) => (finish: FruitSlotFinishModel) => {
    game.timeAnimShowResult(true);
    game.finishShowResult = false;
    const delaySpinAnim = 6;
    const isLucky = finish.result.isLucky;
    setBgVisibility(game.betOptionsUI.bgLockSpin, false);

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
            })
            .delay(1)
            .call(
                () =>
                    (game.betOptionsUI.bigSmallResult.string =
                        finish.result.bigSmall.value < 10
                            ? "0" + finish.result.bigSmall.value.toString()
                            : finish.result.bigSmall.value.toString())
            )
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
    };

const setBgVisibility = (node: cc.Node, visible: boolean, animated = true) => {
    if (animated) {
        cc.tween(node)
            .to(0.3, { opacity: visible ? 255 : 0 })
            .start();
    } else {
        node.opacity = visible ? 255 : 0;
    }
};

const showSettlementResult = (finish: FruitSlotFinishModel) => {
    const winChoice = finish;
    console.log("showSettlementResult", winChoice);
};
