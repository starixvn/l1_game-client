import * as helper from '../../../common/helpers/Helper';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoBetItem extends cc.Component {

    @property(cc.Node)
    inActive: cc.Node = null;

    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(cc.Label)
    ownBet: cc.Label = null;

    public setData(data: any) {
        if (data.data) {
            this.setTotalBet(data.data[this.node.name]);
        }

        if (data.me) {
            this.setOwnBet(data.me[this.node.name]);
        }
    }

    public clear() {
        this.ownBet.string = this.totalBet.string = "";
    }

    protected setOwnBet(bet: number) {
        this.ownBet.string = bet > 0 ? helper.numberWithCommas(bet) : "";
    }

    protected setTotalBet(bet: number) {
        //this.totalBet.string = bet > 0 ? helper.numberWithCommas(bet) : "";

        if (bet > 0) {
            helper.numberTo(this.totalBet, 0, bet, 300, true);
        } else {
            this.totalBet.string = ""
        }
    }

    public setHighlight(highlight: boolean) {
        this.inActive.active = !highlight;
        this.highlight.active = highlight;
    }

    public resetHighlight() {
        this.inActive.active = false;
        this.highlight.active = false;
    }
}
