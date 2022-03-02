import HoldemPokerTicketDetailItem from "../../../holdem-poker/view-models/history/HoldemPokerTicketDetailItem";

const { ccclass } = cc._decorator;

export type TicketDetailItem = {
    bettingOption: string;
    stake: number;
    win: number;
    color: cc.Color;
};
@ccclass
export default class TexasTicketDetailItem extends HoldemPokerTicketDetailItem {
    protected getBettingOptionName(bet: any) {
        return `texasPoker.${bet.betChoice}`;
    }
}
