import * as i18n from "i18n/runtime-scripts/LanguageData";

import { getStringHourByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SicBoTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    type: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    height: number = null;

    updateContent({ time, choice, amount }, settlementResult) {
        const typeNumberText = i18n.t("ui.type_bet_number");
        const totalScoreText = i18n.t("ui.total_score");
        const betTypes = {
            small: i18n.t("ui.type_red_black"),
            big: i18n.t("ui.type_red_black"),
            anyTriple: i18n.t("ui.any_triple"),
            specific1: typeNumberText,
            specific2: typeNumberText,
            specific3: typeNumberText,
            specific4: typeNumberText,
            specific5: typeNumberText,
            specific6: typeNumberText,
            total4: totalScoreText,
            total5: totalScoreText,
            total6: totalScoreText,
            total7: totalScoreText,
            total8: totalScoreText,
            total9: totalScoreText,
            total10: totalScoreText,
            total11: totalScoreText,
            total12: totalScoreText,
            total13: totalScoreText,
            total14: totalScoreText,
            total15: totalScoreText,
            total16: totalScoreText,
            total17: totalScoreText
        };

        const betChoices = {
            small: i18n.t("ui.choice_small"),
            big: i18n.t("ui.choice_big"),
            anyTriple: i18n.t("ui.any_triple"),
            specific1: "1",
            specific2: "2",
            specific3: "3",
            specific4: "4",
            specific5: "5",
            specific6: "6",
            total4: "4",
            total5: "5",
            total6: "6",
            total7: "7",
            total8: "8",
            total9: "9",
            total10: "10",
            total11: "11",
            total12: "12",
            total13: "13",
            total14: "14",
            total15: "15",
            total16: "16",
            total17: "17"
        };

        this.time.string = getStringHourByTime(time);
        this.type.string = betTypes[choice];
        this.choice.string = betChoices[choice];
        this.choice.node.color = settlementResult[choice] ? cc.Color.YELLOW : cc.Color.WHITE;
        this.amount.string = numberWithCommas(amount);
        this.amount.node.color = settlementResult[choice] ? cc.Color.YELLOW : cc.Color.WHITE;
        this.height = this.node.height;
    }
}
