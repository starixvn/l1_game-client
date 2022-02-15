import * as i18n from "i18n/runtime-scripts/LanguageData";

import { getStringHourByTime } from "../../../common/helpers/DateTimeHelper";
import { BetLogDetail } from "./HiLoBetData";
import HiLoCardChoiceView from "./HiLoCardChoiceView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    turn: cc.Label = null;

    @property(cc.Label)
    betChoice: cc.Label = null;

    @property(HiLoCardChoiceView)
    baseCard: HiLoCardChoiceView = null;

    @property(HiLoCardChoiceView)
    resultCard: HiLoCardChoiceView = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    renderTicketDetailItem(logDetail: BetLogDetail) {
        const high = "hiLo.high";
        const low = "hiLo.low";
        this.time.string = getStringHourByTime(logDetail.time);
        this.turn.string = logDetail.order.toString();
        this.betChoice.string = logDetail.choice === "h" ? `${i18n.t(high)}` : `${i18n.t(low)}`;
        this.baseCard.setData(logDetail.cards[0]);
        this.resultCard.setData(logDetail.cards[1]);
        this.stake.string = logDetail.amount.toString();
        this.win.string = logDetail.betwin.toString();
    }
}
