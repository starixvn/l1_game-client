import GameBase from "../../_base/GameBase";
import SedieRoundHistory from "./SedieRoundHistory";
import MiniSedieFinishHandler from "./handlers/MiniSedieFinishHandler";
import MiniSedieLogsHandler from "./handlers/MiniSedieLogsHandler";
import MiniSedieTimeHandler from "./handlers/MiniSedieTimeHandler";
import SedieMiniRoundHistory from "./SedieMiniRoundHistory";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedie extends GameBase {
    @property({ type: cc.Sprite })
    dots: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    dotRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dotWhite: cc.SpriteFrame = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(cc.Prefab)
    roundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    roundHistoryContainer: cc.Node = null;

    @property(cc.Prefab)
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniRoundHistoryContainer: cc.Node = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Node)
    dishNode: cc.Node = null;

    public roundHistory: SedieRoundHistory = null;
    public miniRoundHistory: SedieMiniRoundHistory = null;
    private showLogs = true;
    private configs: any;

    onLoad() {
        super.onLoad();
        var node = cc.instantiate(this.roundHistoryPrefab);
        this.roundHistory = node.getComponent(SedieRoundHistory);
        this.roundHistoryContainer.addChild(node);

        var mini = cc.instantiate(this.miniRoundHistoryPrefab);
        this.miniRoundHistory = mini.getComponent(SedieMiniRoundHistory);
        this.miniRoundHistoryContainer.addChild(mini);
    }

    onDestroy() {
        super.onDestroy();
        this.roundHistoryContainer.destroyAllChildren();
        this.miniRoundHistoryContainer.destroyAllChildren();
    }

    onEnable() {
        super.onEnable();
        cc.RedT.addDataObserver(this.gameName, this.receivedData.bind(this));
    }

    initHandlers() {
        super.initHandlers();
        this.finishHandler = new MiniSedieFinishHandler(this);
        this.timeHandler = new MiniSedieTimeHandler(this);
        this.logsHandler = new MiniSedieLogsHandler(this);
    }

    receivedData(data) {
        if (data.miniSedie) {
            if (data.miniSedie.configs) {
                this.configs = data.miniSedie.configs;
            }
            this.onData(data.miniSedie);
        }
    }

    onDisable() {
        super.onDisable();
        cc.RedT.removeDataObserver(this.gameName);
    }

    public onBetItemClick(e) {
        this.bet({ bet: { amount: this.currentBet, betChoice: e.target.name } });
    }

    public showResult() {
        if (this.currentDataLogs.length) {
            const dataLog = this.currentDataLogs[0];
            this.setDots(dataLog.result);
            this.highlightWonItems(dataLog.settlementResult);
            this.dishNode.active = false;
        }
    }

    private setDots(result) {
        Object.keys(result).forEach((key, index) => {
            this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
        });
    }

    private highlightWonItems(settlementResult) {
        this.betItems.forEach((betItem) => {
            betItem.setHighlight(settlementResult[betItem.node.name]);
        });
    }

    public onToggleShowRoundResult() {
        this.showLogs = !this.showLogs;
        this.ShowRoundResult(this.showLogs);
    }

    private ShowRoundResult(show: boolean) {
        this.roundHistoryContainer.active = show;
    }

    public openHistory() {
        let dialog = cc.instantiate(this.historyPrefab);
        this.currentMiniPanel.node.addChild(dialog);
    }

    public openGuide() {
        let dialog = cc.instantiate(this.guidePrefab);
        var guide = dialog.getComponent("XocXoc_guide");
        guide.init(this.configs);
        this.currentMiniPanel.node.addChild(dialog);
    }
}
