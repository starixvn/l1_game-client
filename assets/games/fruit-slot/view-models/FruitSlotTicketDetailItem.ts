import GameUtils from "../../../common/GameUtils";

import { getStringHourByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;
@ccclass
export default class FruitSlotTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    type: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    height: number = null;

    updateContent(log: any, settlementResult: any) {
        const typeNumberText = GameUtils.getText("ui.type_bet_number");
        const totalScoreText = GameUtils.getText("ui.total_score");
        const betTypes = {
            small: GameUtils.getText("ui.type_big_small"),
            big: GameUtils.getText("ui.type_big_small"),
            bar: typeNumberText,
            watermelon: typeNumberText,
            star: typeNumberText,
            bell: typeNumberText,
            orange: typeNumberText,
            lemon: typeNumberText,
            cherry: totalScoreText
        };

        const betChoices = {
            small: GameUtils.getBetChoiceString("small"),
            big: GameUtils.getBetChoiceString("big"),
            bar: "bar",
            tripleSeven: "tripleSeven",
            watermelon: "watermelon",
            star: "star",
            bell: "bell",
            orange: "orange",
            lemon: "lemon",
            cherry: "cherry"
        };

        this.time.string = getStringHourByTime(log.time);
        this.type.string = betTypes[log.choice];
        this.choice.string = betChoices[log.choice];
        this.amount.string = numberWithCommas(log.amount);

        if (settlementResult[log.choice]) {
            this.choice.node.color = cc.Color.YELLOW;
            this.amount.node.color = cc.Color.YELLOW;
        } else {
            this.choice.node.color = cc.Color.WHITE;
            this.amount.node.color = cc.Color.WHITE;
        }

        this.height = this.node.height;
    }
}
