const { ccclass, property } = cc._decorator;

@ccclass
export default class BetItem extends cc.Component {
    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(cc.Label)
    ownBet: cc.Label = null;

    @property(cc.Label)
    odds: cc.Label = null;

    @property(cc.Node)
    chipNode: cc.Node = null;

    protected setOwnBet(bet: number) {
        this.ownBet.string = bet.toString();
    }

    protected setTotalBet(bet: number) {
        this.totalBet.string = bet.toString();
    }

    public setData(data: any) {
        if (data.data) {
            this.setTotalBet(data.data[this.node.name.toLowerCase()]);
        }

        if (data.me) {
            this.setOwnBet(data.me[this.node.name.toLowerCase()]);
        }
    }

    public clearBet() {
    }

    public setHighlight(highlight: boolean) {
    }

    public resetHighlight() {
    }
}
