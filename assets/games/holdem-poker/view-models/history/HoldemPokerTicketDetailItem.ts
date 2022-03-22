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

    @property(cc.Node)
    bgRowLatest: cc.Node = null;

    protected getBettingOptionName(bet: any) {
        return bet.betChoice === "call" ? `holdEmPoker.${bet.betChoice}Choice` : `holdEmPoker.${bet.betChoice}`;
    }

    protected setBgItem(index: number, countBets: number) {
        if (index % 2 && index === countBets - 1) {
            this.bgRowLatest.active = true;
        } else {
            this.bgRow.active = index % 2 !== 0;
        }
    }

    renderTicketDetailItem(bet: any, index: number, totalRow: number) {
        const bettingOption = this.getBettingOptionName(bet);
        this.bettingOption.string = `${i18n.t(bettingOption)}`;
        this.stake.string = numberWithCommas(bet.stake);
        this.win.string = numberWithCommas(bet.win);
        this.time.string = getStringHourByTime(bet.time);
        this.odd.string = bet.odds ? bet.odds : "-";
        this.setBgItem(index, totalRow);
        if (bet.win > 0) {
            this.stake.node.color = cc.Color.YELLOW;
            this.win.node.color = cc.Color.YELLOW;
            this.odd.node.color = cc.Color.YELLOW;
            this.bettingOption.node.color = cc.Color.YELLOW;
        }
    }
}
