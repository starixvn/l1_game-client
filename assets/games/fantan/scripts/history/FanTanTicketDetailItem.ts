import { numberWithCommas } from "../../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FanTanTicketDetailItem extends cc.Component {
    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    betChoice: cc.Label = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Node)
    bgRow: cc.Node = null;

    setData(data: any, choice: string, index: number) {
        this.odd.string = data.odds[choice];
        this.betChoice.string = choice;
        this.stake.string = data[choice];
        this.win.string = numberWithCommas(data[choice] * data.odds[choice], 2);
        this.bgRow.active = index % 2 > 0;
    }
}
