import * as i18n from "i18n/runtime-scripts/LanguageData";

import MiniRoundHistoryTip from "../../../common/mini-round-history/MiniRoundHistoryTip";

const { ccclass } = cc._decorator;

@ccclass
export default class BigSmallRoundHistoryTip extends MiniRoundHistoryTip {
    protected readonly betTypes = ["big", "small"];

    public setData(data: any) {
        this.roundId.string = `#${data.roundId}`;
        const key = data.settlementResult[this.betTypes[0]] ? this.betTypes[0] : this.betTypes[1];
        const message = i18n.t(`ui.choice_${key}`);
        this.result.string = `${message} (${data.result.dice1}-${data.result.dice2}-${data.result.dice3})`;
    }
}
