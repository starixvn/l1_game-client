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

    setData(data: any) {
        const isLoginUser = data.name === cc.RedT.user.name;
        this.highlight.active = isLoginUser;
        this.time.string = getStringHourByTime(data.time);
        this.username.string = isLoginUser ? data.name : shortenName(data.name);

        const convertValue = GameUtils.getValueByCurrency(data.amount, data.rate || 1);
        this.betAmount.string = numberWithCommas(convertValue);
        this.refund.string = numberWithCommas(data.refund);
    }
}
