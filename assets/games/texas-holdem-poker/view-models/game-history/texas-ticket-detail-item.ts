import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import HoldemPokerTicketDetailItem from "../../../holdem-poker/view-models/history/HoldemPokerTicketDetailItem";

const { ccclass, property, menu } = cc._decorator;

export type TicketDetailItem = {
    bettingOption: string;
    stake: number;
    win: number;
    color: cc.Color;
};
@ccclass
export default class TexasTicketDetailItem extends HoldemPokerTicketDetailItem {
    renderTicketDetailItem(bet: any, index: number) {}
}
