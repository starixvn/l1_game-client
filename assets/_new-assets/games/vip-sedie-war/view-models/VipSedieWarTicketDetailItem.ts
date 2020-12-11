import { getStringHourByTime, numberWithCommas } from "./../../../common/helpers/Helper";
import VipSedieWarUtils from "./VipSedieWarUtils";


const { ccclass, property } = cc._decorator;
@ccclass
export default class VipSedieWarTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    setData(data: any) {
        this.choice.string = VipSedieWarUtils.getBetChoiceString(data.choice);
        this.amount.string = numberWithCommas(data.amount);
        this.time.string = getStringHourByTime(data.time);
    }

    setHighlightWinChoice(highlight: boolean) {
        this.amount.node.color = highlight ? cc.color(246, 193, 8) : cc.Color.WHITE;
    }
}
