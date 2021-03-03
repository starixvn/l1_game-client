import GameUtils from "../../../common/GameUtils";
import { games } from "../../../configs/SabaConfigs";
import SocketIOTableGameBase from "../../_base/SocketIOTableGameBase";
import KenoFinishHandler from "./handlers/KenoFinishHandler";
import KenoLogsHandler from "./handlers/KenoLogsHandler";
import KenoTimeHandler from "./handlers/KenoTimeHandler";
import KenoRoundResult from "./history/KenoRoundResult";
import KenoUserHistory from "./history/KenoUserHistory";
import { KenoConfigs } from "./KenoConfigs";
import KenoNumber from "./KenoNumber";
import RoundHistory from "./RoundHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Keno extends SocketIOTableGameBase {
    @property(KenoRoundResult)
    roundResult: KenoRoundResult = null;

    @property(RoundHistory)
    roundHistory: RoundHistory = null;

    @property(cc.Node)
    tableNode: cc.Node = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Node)
    chipContainer: cc.Node = null;

    @property(cc.Node)
    totalBetContainer: cc.Node = null;

    @property(cc.Node)
    ownBetContainer: cc.Node = null;

    public resultAnimating = false;
    public kenoNumbers: KenoNumber[] = [];
    private historyComponent: KenoUserHistory;

    constructor() {
        super();
        this.init("KenoProMax", new KenoConfigs(), null, 1, games.KenoProMax.id);
    }

    initHandlers() {
        super.initHandlers();

        this.finishHandler = new KenoFinishHandler(this);
        this.timeHandler = new KenoTimeHandler(this);
        this.logsHandler = new KenoLogsHandler(this);
    }

    public pressedHistoryDialog() {
        cc.RedT.audio.playClick();

        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(KenoUserHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(dialog);
    }

    public pressedShowGuide() {
        cc.RedT.audio.playClick();
        const dialog = cc.instantiate(this.guidePrefab);
        const kenoGuide = dialog.getComponent("KenoGuide");
        kenoGuide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(dialog);
    }

    onLoad() {
        super.onLoad();
        const check = cc.sys.localStorage.getItem(this.gameName);
        if (check === "true") {
            this.node.active = true;
        }

        this.roundHistory.init(this);
        this.betItems.forEach((item) => {
            GameUtils.moveToOtherNode(item.chipNode, this.chipContainer);
            GameUtils.moveToOtherNode(item.totalBet.node, this.totalBetContainer);
            GameUtils.moveToOtherNode(item.ownBet.node, this.ownBetContainer);
        });
    }

    onDataGameRoom(data) {
        if (data.history) {
            this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.roundResult.node.active = false;
    }

    public updateRoundHistory() {
        this.roundHistory.setData(this.currentDataLogs);
    }

    public static getResults(settlementResult: any): string[] {
        const results = [];

        if (!settlementResult) {
            return results;
        }

        Object.keys(settlementResult).forEach((key, index) => {
            if (settlementResult[key]) {
                results.push(key);
            }
        });

        return results;
    }
}
