import * as i18n from "i18n/runtime-scripts/LanguageData";
import BigSmallRoundResult from "../../bigsmall/view-models/BigSmallRoundResult";

const { ccclass } = cc._decorator;

@ccclass
export default abstract class TurboOddEveRoundResult extends BigSmallRoundResult {
    updateLabels(data: any) {
        const { settlementResult, result } = data;

        this.total.string = result.dice1 + result.dice2 + result.dice3;
        this.result.string = i18n.t(`ui.scoreboard_${settlementResult.odd ? "odd" : "even"}`);
    }
}
