import { numberWithCommas } from "../../../../common/helpers/NumberHelper";

const { ccclass, property, menu } = cc._decorator;

export type TicketDetailItem = {
    bettingOption: string;
    stake: number;
    win: number;
    color: cc.Color;
};
@ccclass
export default class TexasTicketDetailItem extends cc.Component {
    @property(cc.Label)
    bettingOption: cc.Label = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    render(item: TicketDetailItem) {
        this.bettingOption.string = item.bettingOption;
        this.stake.string = numberWithCommas(item.stake);
        this.win.string = numberWithCommas(item.win);
        this.win.node.color = item.color;
    }
}
