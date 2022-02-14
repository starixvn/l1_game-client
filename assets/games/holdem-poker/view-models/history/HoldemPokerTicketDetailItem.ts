import * as i18n from "i18n/runtime-scripts/LanguageData";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import { getStringHourByTime } from "../../../../common/helpers/DateTimeHelper";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Games/HolemPoker/HoldemPokerTicketDetailItem")
export default class HoldemPokerTicketDetailItem extends cc.Component {
    @property(cc.Label)
    bettingOption: cc.Label = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Node)
    bgRow: cc.Node = null;

    renderTicketDetailItem(bet: any, index: number) {
        const bettingOption = bet.betChoice === "call" ? `holdEmPoker.${bet.betChoice}Choice` : `holdEmPoker.${bet.betChoice}`;
        console.log(bettingOption);
        this.bettingOption.string = `${i18n.t(bettingOption)}`;
        this.stake.string = numberWithCommas(bet.stake);
        this.win.string = numberWithCommas(bet.win);
        this.time.string = getStringHourByTime(bet.time);
        this.odd.string = bet.odds ? bet.odds : "-";
        this.bgRow.active = index % 2 !== 0;
        if (bet.win > 0) {
            this.stake.node.color = cc.Color.YELLOW;
            this.win.node.color = cc.Color.YELLOW;
            this.odd.node.color = cc.Color.YELLOW;
            this.bettingOption.node.color = cc.Color.YELLOW;
        }
    }
}
