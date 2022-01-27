import { HiLoState } from "../events-models/HiLoState";
import { HiLoStateModel } from "../events-models/HiLoStateModel";
import HiLo from "../view-models/HiLo";
import { HiLoResultModel } from "../events-models/HiLoResultModel";
import HiLoResult from "../view-models/HiLoResult";

export const handleAllButtons = (mainGame: HiLo) => (stateModel: HiLoStateModel) => {
    switch (stateModel.state) {
        case HiLoState.BLANK_NEW:
            mainGame.playButton.node.active = true;
            mainGame.disableAllBetOption(true);
            mainGame.disableCollectButton(true);
            mainGame.showUserLoseMessage(false, false);
            break;
        case HiLoState.IN_TURN:
        case HiLoState.SETTLED:
            mainGame.playButton.node.active = false;
            mainGame.disableAllBetOption(false);
            mainGame.disableCollectButton(false);
            break;
        default:
            break;
    }
};

export const resetBetWin = (mainGame: HiLo) => (stateModel: HiLoStateModel) => {
    if (stateModel.state == HiLoState.BLANK_NEW) {
        mainGame.stakesComp.setBetWin(mainGame.betAmount);
    }
};

export const hideResultCard = (resultComp: HiLoResult) => (stateModel: HiLoStateModel) => {
    if (stateModel.state == HiLoState.BLANK_NEW) {
        resultComp.resetNewRound();
    }
};
