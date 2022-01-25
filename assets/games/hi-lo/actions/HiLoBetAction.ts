import { HiLoState } from "../events-models/HiLoState";
import { HiLoStateModel } from "../events-models/HiLoStateModel";
import HiLo from "../view-models/HiLo";

export const handlePlayButton = (mainGame: HiLo) => (stateModel: HiLoStateModel) => {
    switch (stateModel.state) {
        case HiLoState.start_round:
            mainGame.playButton.node.active = false;
            mainGame.showUserLoseMessage(false, false);
            break;
        case HiLoState.change_turn:
        case HiLoState.in_turn:
            mainGame.playButton.node.active = false;
            break;
        case HiLoState.settled:
            mainGame.playButton.node.active = true;
            break;
        default:
            break;
    }
};

export const handleHiLoCollectButtons = (mainGame: HiLo) => (stateModel: HiLoStateModel) => {
    switch (stateModel.state) {
        case HiLoState.start_round:
        case HiLoState.settled:
        case HiLoState.change_turn:
            mainGame.disableAllBetOption(true);
            mainGame.disableCollectButton(true);
            break;
        case HiLoState.in_turn:
            mainGame.disableAllBetOption(false);
            mainGame.disableCollectButton(false);
            break;
        default:
            break;
    }
};
