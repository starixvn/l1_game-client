import { HoldemPockerMD5Model } from "./../../holdem-poker/event-models/HoldemPockerMD5Model";
import { TexasState } from "../texas-type";
import TexasStateModel from "./../event-models/texas-state-model";
import Texas from "../view-models/texas";
import HoldemPockerMD5 from "../../holdem-poker/view-models/HoldemPockerMD5";

export const handleMD5 = (main: Texas) => (stateModel: TexasStateModel) => {
    switch (stateModel.state) {
        case TexasState.replay_new:
        case TexasState.blank_new:
        case TexasState.calling_fold:
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
