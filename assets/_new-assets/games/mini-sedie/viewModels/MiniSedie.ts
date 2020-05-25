import GameBase from "../../_base/GameBase";
import SedieRoundResult from "./SedieRoundResult";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedie extends GameBase {

    @property(cc.Prefab)
    roundResultPrefab: cc.Prefab = null;

    @property(cc.Node)
    roundResultContainer: cc.Node = null;

    public roundResult: SedieRoundResult = null;
    private showLogs = true;

    onLoad() {
        super.onLoad();
        var node = cc.instantiate(this.roundResultPrefab);
        this.roundResult = node.getComponent(SedieRoundResult);
        this.roundResultContainer.addChild(node);
    }

    onDestroy() {
        super.onDestroy();
        this.roundResultContainer.destroyAllChildren();
    }

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
            bet: { amount: this.currentBet, betChoice: e.target.name }
        });
    }

    public onToggleShowRoundResult() {
        this.showLogs = !this.showLogs;
        this.ShowRoundResult(this.showLogs);
    }

    private ShowRoundResult(show: boolean) {
        this.roundResultContainer.active = show;
    }
}
