import GameBase from "../../_base/GameBase";
import SedieRoundResult from "./SedieRoundResult";
import MiniSedieFinishHandler from "./handlers/MiniSedieFinishHandler";
import MiniSedieLogsHandler from "./handlers/MiniSedieLogsHandler";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedie extends GameBase {
    @property({ type: cc.Sprite })
    dices: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    dotRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dotWhite: cc.SpriteFrame = null;

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

    initHandlers() {
        super.initHandlers();
        this.finishHandler = new MiniSedieFinishHandler(this);
        this.logsHandler = new MiniSedieLogsHandler(this);
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

    public setDots(result) {
        Object.keys(result).forEach((key, index) => {
            this.dices[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
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
