import GameUtils from "../../common/GameUtils";
import { getStringHourByTime } from "../../common/helpers/DateTimeHelper";
import { shortenName } from "../../common/helpers/NicknameHelper";
import { numberWithCommas } from "../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BalancedBettingPoolBetItemBase extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    username: cc.Label = null;

    @property(cc.Label)
    betAmount: cc.Label = null;

    @property(cc.Label)
    refund: cc.Label = null;

    @property(cc.Node)
    highlight: cc.Node = null;

    setData(data: any, userRate: number, multiplier) {
        const isLoginUser = data.name === cc.RedT.user.name;
        this.highlight.active = isLoginUser;
        this.time.string = getStringHourByTime(data.time);
        this.username.string = isLoginUser ? data.name : shortenName(data.name);

        const convertValue = GameUtils.getTicketValueByCurrency(data.amount, userRate, data.rate || multiplier);
        this.betAmount.string = numberWithCommas(convertValue, 2);

        const convertRefund = GameUtils.getTicketValueByCurrency(data.refund, userRate, data.rate || multiplier);
        this.refund.string = numberWithCommas(convertRefund, 2);
    }
}
