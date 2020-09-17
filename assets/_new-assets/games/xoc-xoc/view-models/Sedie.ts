import { gameIds } from "../../../Configs";
import NewSocketGameBase from "../../_base/NewSocketGameBase";
import SedieMiniRoundHistory from "../../mini-sedie/viewModels/SedieMiniRoundHistory";
import SedieRoundHistory from "../../mini-sedie/viewModels/SedieRoundHistory";
import SedieBetHandler from "./handlers/SedieBetHandler";
import SedieFinishHandler from "./handlers/SedieFinishHandler";
import SedieLogsHandler from "./handlers/SedieLogsHandler";
import SedieStatusHandler from "./handlers/SedieStatusHandler";
import SedieTimeHandler from "./handlers/SedieTimeHandler";
import { SedieConfigs } from "./SedieConfigs";
import SedieGuide from "./SedieGuide";
import SedieHistory from "./SedieHistory";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Sedie extends NewSocketGameBase {

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    roundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    roundHistoryContainer: cc.Node = null;

    @property(cc.Prefab)
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniRoundHistoryContainer: cc.Node = null;

    @property(cc.Animation)
    shakeThePlateAnimation: cc.Animation = null;

    @property(cc.AudioSource)
    shakeThePlateAudio: cc.AudioSource = null;

    @property(cc.Node)
    thePlate: cc.Node = null;

    @property({ type: cc.Sprite })
    dots: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    dotRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dotWhite: cc.SpriteFrame = null;

    private roundHistory: SedieRoundHistory;
    private miniRoundHistory: SedieMiniRoundHistory;
    private historyComponent: SedieHistory;

    constructor() {
        super();
        this.internalInit();
    }

    protected internalInit() {
        this.init("XocXoc", new SedieConfigs(), null, 1, gameIds.XocXoc);
        this.finishShowResult = false;

    }

    initHandlers() {
        super.initHandlers();

        this.logsHandler = new SedieLogsHandler(this);
        this.timeHandler = new SedieTimeHandler(this);
        this.finishHandler = new SedieFinishHandler(this);
        this.betHandler = new SedieBetHandler(this);
        this.statusHandler = new SedieStatusHandler(this);
    }

    onLoad() {
        super.onLoad();

        this.initRoundHistory();
        this.animatedTime.setAnimatedY(30, -5);
    }

    initRoundHistory() {
        const node = cc.instantiate(this.roundHistoryPrefab);
        this.roundHistory = node.getComponent(SedieRoundHistory);
        const condition = () => {
            return this.currentTimeRemaining < this.config.stopBetTime || this.currentTimeRemaining > this.config.fullTime;
        };
        this.roundHistory.logControl.init(condition);
        this.roundHistoryContainer.addChild(node);

        var mini = cc.instantiate(this.miniRoundHistoryPrefab);
        this.miniRoundHistory = mini.getComponent(SedieMiniRoundHistory);
        this.miniRoundHistoryContainer.addChild(mini);
    }

    updateRoundHistory() {
        const miniHistoryData = this.currentDataLogs.map((d) => {
            let count = 0;
            const list = ["red1", "red2", "red3", "red4"];
            list.forEach((i) => {
                if (d.result[i]) {
                    count++;
                }
            });
            return {
                roundId: d.roundId || d.id || d.round,
                red: count,
            };
        });
        this.roundHistory.setData(miniHistoryData.map((d) => d.red));
        this.miniRoundHistory.setData(miniHistoryData);
    }

    openGuide() {
        let dialog = cc.instantiate(this.guidePrefab);
        const guide = dialog.getComponent(SedieGuide);
        guide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(dialog);
    }

    openHistory() {
        let dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(SedieHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(dialog);
    }

    onDataGameRoom(data) {
        if (data.history) {
            this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }

    setDots(result) {
        Object.keys(result).forEach((key, index) => {
            this.dots[index].spriteFrame = result[key] ? this.dotRed : this.dotWhite;
        });
    }

    showResult() {
        if (this.currentDataLogs.length > 0) {
            const { result, settlementResult } = this.currentDataLogs[0];
            this.setDots(result);
            this.betItems.forEach(betItem => betItem.setHighlight(settlementResult[betItem.node.name.toLowerCase()], true));
            this.updateRoundHistory();
        }
    }
}
