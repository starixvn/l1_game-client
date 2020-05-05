const { ccclass, property } = cc._decorator;

@ccclass
export default class BetItem extends cc.Component {
    protected setOwnBet(bet: number) { }

    protected setTotalBet(bet: number) { }

    public setData(data: any) {
        if (data.data) {
            this.setTotalBet(data.data[this.node.name]);
        }

        if (data.me) {
            this.setOwnBet(data.me[this.node.name]);
        }
    }

    public clearBet() {
    }

    public setHighlight(highlight: boolean) {
    }

    public resetHighlight() {
    }
}
