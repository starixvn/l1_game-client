import DraggableItem from "../../../common/draggable-layout/view-models/DraggableItem";
// import WebSocketMiniGameBase from "../../_base/WebSocketMiniGameBase";
import MiniSedieFinishHandler from "./handlers/MiniSedieFinishHandler";
import MiniSedieLogsHandler from "./handlers/MiniSedieLogsHandler";
import MiniSedieTimeHandler from "./handlers/MiniSedieTimeHandler";
import MiniSedieGuide from "./MiniSedieGuide";
import SedieMiniRoundHistory from "./SedieMiniRoundHistory";
import SedieRoundHistory from "./SedieRoundHistory";
import { games } from "../../../configs/SabaConfigs";
import SocketIOMiniGameBase from "../../_base/SocketIOMiniGameBase";
import MiniSedieHistory from "./MiniSedieHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedie extends SocketIOMiniGameBase {
    get gameId() {
        return games.MiniSedie.id;
    }

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
    public resultAnimating = false;
    private historyComponent: MiniSedieHistory;

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }
        super.onLoad();
        const node = cc.instantiate(this.roundHistoryPrefab);
        this.roundHistory = node.getComponent(SedieRoundHistory);
        this.roundHistory.init(this);
        this.roundHistoryContainer.addChild(node);

        const mini = cc.instantiate(this.miniRoundHistoryPrefab);
        this.miniRoundHistory = mini.getComponent(SedieMiniRoundHistory);
        this.miniRoundHistoryContainer.addChild(mini);
        this.animatedTime.setAnimatedY(30, -5);

        const dragableItem = this.getComponent(DraggableItem);
        dragableItem.touchCallback.start = (node) => {
            this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
        };
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.animation.node.active = false;
    }

    onDestroy() {
        super.onDestroy();
        this.roundHistoryContainer.isValid && this.roundHistoryContainer.destroyAllChildren();
        this.miniRoundHistoryContainer.isValid && this.miniRoundHistoryContainer.destroyAllChildren();
    }

    onData(data: any) {
        super.onData(data);
        if (data.history) {
            this.historyComponent.onData(data.history);
        }
    }

    onEnable() {
        super.onEnable();
        this.showLogs = true;
        this.showRoundHistory(this.showLogs);
    }

    initHandlers() {
        super.initHandlers();
        this.finishHandler = new MiniSedieFinishHandler(this);
        this.timeHandler = new MiniSedieTimeHandler(this);
        this.logsHandler = new MiniSedieLogsHandler(this);
    }

    public showResult() {
        if (this.currentDataLogs.length) {
            const dataLog = this.currentDataLogs[0];
            this.setDots(dataLog.result);
            this.highlightWonItems(dataLog.settlementResult, true);
            this.dishNode.position = cc.v2(0, 150);
            this.dishNode.active = false;
        }
    }

    public highlightLastResult() {
        if (this.currentTimeRemaining <= this.config.stopBetTime) {
            return;
        }
        const dataLog = this.currentDataLogs[0];
        dataLog && this.highlightWonItems(dataLog.settlementResult, false);
    }

    public setDots(result) {
        Object.keys(result).forEach((key, index) => {
            this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
        });
    }

    private highlightWonItems(settlementResult: any, isAnimated = true) {
        this.betItems.forEach((betItem) => {
            betItem.setHighlight(settlementResult[betItem.node.name], isAnimated);
        });
    }

    public updateRoundHistory() {
        const miniHistoryData = this.currentDataLogs.map((d) => {
            let count = 0;
            const list = ["red1", "red2", "red3", "red4"];
            list.forEach((i) => {
                if (d.result[i]) {
                    count++;
                }
            });
            return {
                roundId: d.roundId || d.id,
                red: count
            };
        });
        this.roundHistory.setData(miniHistoryData.map((d) => d.red));
        this.miniRoundHistory.setData(miniHistoryData);
    }

    public onToggleShowRoundResult() {
        this.showLogs = !this.showLogs;
        this.showRoundHistory(this.showLogs);
    }

    public showRoundHistory(show: boolean) {
        this.roundHistoryContainer.active = show;
    }

    public openHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(MiniSedieHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(dialog);
    }

    public openGuide() {
        const dialog = cc.instantiate(this.guidePrefab);
        const guide = dialog.getComponent(MiniSedieGuide);
        guide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(dialog);
    }
}
