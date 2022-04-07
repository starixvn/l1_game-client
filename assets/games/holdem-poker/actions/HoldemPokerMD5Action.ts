import { HoldemPokerMD5Model } from "../event-models/HoldemPokerMD5Model";
import { HoldemPokerState } from "../event-models/HoldemPokerState";
import { HoldemPokerStateModel } from "../event-models/HoldemPokerStateModel";
import HoldemPockerMD5 from "../view-models/HoldemPockerMD5";
import HoldemPoker from "../view-models/HoldemPoker";

export const handleMD5 = (main: HoldemPoker) => (stateModel: HoldemPokerStateModel) => {
    switch (stateModel.state) {
        case HoldemPokerState.replay_new:
        case HoldemPokerState.blank_new:
        case HoldemPokerState.calling_fold:
            // case HoldemPokerState.prepare_new:
            main.md5Comp.clearMD5();
            break;

        default:
            break;
    }
};

export const updateMD5 = (md5Comp: HoldemPockerMD5) => (model: HoldemPokerMD5Model) => {
    if (typeof model.md5 === "string") {
        md5Comp.setMD5String(model.md5);
    }
};
