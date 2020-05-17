import GameBase from "../../_base/GameBase";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedie extends GameBase {

    onEnable() {
        super.onEnable()
        cc.RedT.addDataObserver(this.gameName, this.receivedData.bind(this));
    }

    receivedData(data) {
        if (data.miniSedie) {
            this.onData(data.miniSedie);
        }
    }

    onDisable() {
        super.onDisable();
        cc.RedT.removeDataObserver(this.gameName);
    }

    public onBetItemClick(e) {
        this.bet({
            bet: { amount: this.currentBet, box: e.target.name }
        });
    }
}
