import { TexasState } from "../texas-type";
import TexasStateModel from "./../event-models/texas-state-model";
import Texas from "../view-models/texas";
import { MD5ModelBase } from "../../_casino/event-models/MD5ModelBase";
import CasinoMD5 from "../../_casino/CasinoMD5";

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

export const updateMD5 = (md5Comp: CasinoMD5) => (model: MD5ModelBase) => {
    if (typeof model.md5 === "string") {
        md5Comp.setMD5String(model.md5);
    }
};
