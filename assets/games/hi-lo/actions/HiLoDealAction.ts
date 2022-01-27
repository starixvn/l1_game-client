import HiLoStakes from "../view-models/HiLoStakes";
import HiLo from "../view-models/HiLo";
import { HiLoTurnModel } from "../events-models/HiLoTurnModel";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import HiLoResult from "../view-models/HiLoResult";
import { HiLoResultModel } from "../events-models/HiLoResultModel";

export const updateStakes = (stakeComp: HiLoStakes) => (resultModel: HiLoResultModel) => {
    if (resultModel.nextAmount.betWin) {
        stakeComp.updateAllStakes(resultModel.nextAmount);
    } else {
        stakeComp.updateHigherLowerStakes(resultModel.nextAmount);
    }
};

export const handleResultSettle = (mainGame: HiLo) => (statusModel: HiLoStatusModel) => {
    if (!statusModel.win) {
        mainGame.showUserLoseMessage(true);
    }

    mainGame.enableAllBetOption(false);
    mainGame.enableCollectButton(false);
    mainGame.turnOrder = 0;
    cc.tween(mainGame)
        .delay(mainGame.settleAnimation)
        .call(() => {
            mainGame.gameData.stateModel.prepareNewRound();
        })
        .start();
};

export const updateTurnOrder = (mainGame: HiLo) => (turnModel: HiLoTurnModel) => {
    mainGame.turnOrder = turnModel.turnOrder;
};

export const updateCard = (resultComp: HiLoResult) => (resultModel: HiLoResultModel) => {
    if (resultModel.result.length > 0) {
        resultComp.setResult(resultModel.result[resultModel.result.length - 1]);
    }
};
