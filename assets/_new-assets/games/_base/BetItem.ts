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

    @property(cc.Node)
    highlight: cc.Node = null;

    protected setOwnBet(bet: number) {
        this.ownBet.string = bet.toString();
    }

    protected setTotalBet(bet: number) {
        this.totalBet.string = bet.toString();
    }

    public setData(data: any) {
        if (data.totalBets) {
            this.setTotalBet(data.totalBets[this.node.name.toLowerCase()]);
        }

        if (data.ownBet) {
            this.setOwnBet(data.ownBet[this.node.name.toLowerCase()]);
        }
    }

    public setOdd(value: string) {
        this.odds.string = value;
    }

    public clearBet() {
        this.setOwnBet(0);
        this.setTotalBet(0);
    }

    public setHighlight(highlight: boolean) {
        this.highlight.active = highlight;
    }

    public resetHighlight() {
        this.highlight.active = false;
    }
}
