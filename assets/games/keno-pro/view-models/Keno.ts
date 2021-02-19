import GameUtils from "../../../common/GameUtils";
import { games } from "../../../configs/SabaConfigs";
import WebSocketTableGameBase from "../../_base/WebSocketTableGameBase";
import KenoFinishHandler from "./handlers/KenoFinishHandler";
import KenoLogsHandler from "./handlers/KenoLogsHandler";
import KenoTimeHandler from "./handlers/KenoTimeHandler";
import KenoRoundResult from "./history/KenoRoundResult";
import { KenoConfigs } from "./KenoConfigs";
import KenoNumber from "./KenoNumber";
import RoundHistory from "./RoundHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Keno extends WebSocketTableGameBase {
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

    constructor() {
        super();
        this.init("kenoProMax", new KenoConfigs(), null, 1, games.KenoProMax.id);
    }

    initHandlers() {
        super.initHandlers();

        this.finishHandler = new KenoFinishHandler(this);
        this.timeHandler = new KenoTimeHandler(this);
        this.logsHandler = new KenoLogsHandler(this);
    }

    //#region Public Methods
    public onCuocClick(e) {
        this.bet({
            bet: { amount: this.currentBet, box: e.target.name }
        });
    }

    public pressedHistoryDialog() {
        cc.RedT.audio.playClick();

        const dialog = cc.instantiate(this.historyPrefab);
        this.currentMiniPanel.node.addChild(dialog);
    }

    public pressedShowGuide() {
        cc.RedT.audio.playClick();
        const dialog = cc.instantiate(this.guidePrefab);
        const kenoGuide = dialog.getComponent("KenoGuide");
        kenoGuide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(dialog);
    }
    //#endregion

    //#region Component Methods
    onDestroy() {
        super.onDestroy();
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
    //#endregion

    //#region Private Methods
    resetDataAndUI() {
        super.resetDataAndUI();
        this.roundResult.node.active = false;
    }

    regEvent(show: boolean) {
        const data = {
            view: show,
            get_time: show,
            getLogs: show
        };
        this.sendData(data);
    }

    //#endregion Private Methods

    //#region Game Methods
    public updateRoundHistory() {
        this.roundHistory.setData(this.currentDataLogs);
    }

    public getTempTotal(numberArray: number[], index: number): number {
        let total = 0;
        for (let i = 0; i <= index; i++) {
            total += numberArray[i];
        }
        return total;
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
    //#endregion
}
