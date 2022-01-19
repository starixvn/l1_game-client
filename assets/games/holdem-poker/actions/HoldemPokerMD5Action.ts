import { HoldemPokerState } from "../event-models/HoldemPokerState";
import { HoldemPokerStateModel } from "../event-models/HoldemPokerStateModel";
import HoldemPockerMD5 from "../view-models/HoldemPockerMD5";
import HoldemPoker from "../view-models/HoldemPoker";
import * as i18n from "i18n/runtime-scripts/LanguageData";

export const handleMD5 = (main: HoldemPoker) => (stateModel: HoldemPokerStateModel) => {
    switch (stateModel.state) {
        case HoldemPokerState.ante_bet:
        case HoldemPokerState.aa_bet:
        case HoldemPokerState.all_bet:
        case HoldemPokerState.calling_deal:
        case HoldemPokerState.replay_new:
        case HoldemPokerState.blank_new:
            main.md5Comp.resetDefaultValue(i18n.t("holdEmPoker.md5String"), false);
            break;
        case HoldemPokerState.calling_call:
            main.md5Comp.resetDefaultValue(i18n.t("holdEmPoker.md5Key"), true);
            break;
        case HoldemPokerState.calling_fold:
            main.md5Comp.resetDefaultValue(i18n.t("holdEmPoker.md5String"), false);
            main.md5Comp.setIsFold(true);
            break;
        case HoldemPokerState.prepare_new:
            main.md5Comp.setIsFold(false);
            break;

        case HoldemPokerState.dealing:
        case HoldemPokerState.dealt:
        case HoldemPokerState.settled:
            break;
    }
};

export const updateMD5 = (md5Comp: HoldemPockerMD5) => (configs) => {
    typeof configs.md5 === "string" ? md5Comp.setMD5String(configs.md5) : md5Comp.setMD5Key(configs.md5);
};
