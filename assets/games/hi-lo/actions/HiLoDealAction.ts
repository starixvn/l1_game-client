import HiLoStakes from "../view-models/HiLoStakes";
import HiLo from "../view-models/HiLo";
import { HiLoStatusModel } from "../events-models/HiLoStatusModel";
import HiLoResult from "../view-models/HiLoResult";
import { HiLoResultModel } from "../events-models/HiLoResultModel";

export const updateStakes = (stakeComp: HiLoStakes) => (resultModel: HiLoResultModel) => {
    stakeComp.updateStakes(resultModel.nextAmount);
};

export const handleSettle = (mainGame: HiLo) => (statusModel: HiLoStatusModel) => {
    if (!statusModel.win) {
        mainGame.showUserLoseMessage(true);
    }

    mainGame.enableAllBetOptions(false);
    mainGame.enableCollectButton(false);
    cc.tween(mainGame)
        .delay(mainGame.settleAnimation)
        .call(() => {
            mainGame.gameData.stateModel.prepareNewRound();
        })
        .start();
};

export const updateCard = (resultComp: HiLoResult) => (resultModel: HiLoResultModel) => {
    if (resultModel.result.length > 0) {
        resultComp.setResult(resultModel.result[resultModel.result.length - 1]);
    }
};
