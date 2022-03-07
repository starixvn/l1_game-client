import { HoldemPockerMD5Model } from "./../../holdem-poker/event-models/HoldemPockerMD5Model";
import { TexasHoldemPokerState } from "../texas-type";
import { TexasHoldemPokerStateModel } from "./../event-models/texas-holdem-poker-state-model";
import TexasHoldemPoker from "../view-models/texas-holdem-poker";
import HoldemPockerMD5 from "../../holdem-poker/view-models/HoldemPockerMD5";

export const handleMD5 = (main: TexasHoldemPoker) => (stateModel: TexasHoldemPokerStateModel) => {
    switch (stateModel.state) {
        case TexasHoldemPokerState.replay_new:
        case TexasHoldemPokerState.blank_new:
        case TexasHoldemPokerState.calling_fold:
            main.md5Comp.clearMD5();
            break;
        default:
            break;
    }
};

export const updateMD5 = (md5Comp: HoldemPockerMD5) => (model: HoldemPockerMD5Model) => {
    if (typeof model.md5 === "string") {
        md5Comp.setMD5String(model.md5);
    }
};
