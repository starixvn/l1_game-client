import * as i18n from "i18n/runtime-scripts/LanguageData";

import MiniRoundHistoryTip from "../../../common/mini-round-history/MiniRoundHistoryTip";
import { SicBoBetType } from "./SicBo";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoRoundHistoryTip extends MiniRoundHistoryTip {
    public setData(data: any) {
        this.roundId.string = `#${data.roundId}`;

        const betChoices = {
            small: "ui.choice_small",
            big: "ui.choice_big",
            anyTriple: "ui.any_triple"
        };
        let key = "";
        if (data.settlementResult[SicBoBetType.anyTriple]) {
            key = betChoices[SicBoBetType.anyTriple];
        } else {
            if (data.settlementResult[SicBoBetType.big]) {
                key = betChoices[SicBoBetType.big];
            } else {
                key = betChoices[SicBoBetType.small];
            }
        }

        const keyText = i18n.t(key).toUpperCase();
        this.result.string = `${keyText} (${data.result.dice1}-${data.result.dice2}-${data.result.dice3})`;
        this.show();
    }
}
