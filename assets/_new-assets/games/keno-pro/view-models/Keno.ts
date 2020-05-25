import GameRoomBase from "../../_base/GameRoomBase";
import KenoTimeHandler from './handlers/KenoTimeHandler';
import KenoFinishHandler from './handlers/KenoFinishHandler';
import { KenoConfigs } from './KenoConfigs';
import KenoNumber from './KenoNumber';
import RoundHistory from './RoundHistory';
import KenoLogsHandler from './handlers/KenoLogsHandler';
import KenoRoundResult from "./history/KenoRoundResult";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Keno extends GameRoomBase {

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

    public resultAnimating = false;
    public kenoNumbers: KenoNumber[] = [];

    constructor() {
        super();


        this.init("kenoProMax", new KenoConfigs());
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

        var dialog = cc.instantiate(this.historyPrefab);
        this.tableNode.addChild(dialog);
    }

    public pressedShowGuide() {
        cc.RedT.audio.playClick();
        let dialog = cc.instantiate(this.guidePrefab);
        this.currentMiniPanel.node.addChild(dialog);
    }
    //#endregion

    //#region Component Methods
    onDestroy() {
        super.onDestroy();
    }

    onLoad() {
        super.onLoad();
        var check = cc.sys.localStorage.getItem(this.gameName);
        if (check == "true") {
            this.node.active = true;
        }

        if (!cc.sys.isMobile) {
            var originPos = this.roundHistory.node.position;
            this.roundHistory.node.position = cc.v2(originPos.x, originPos.y + 40);
        }
        this.roundHistory.init(this);
        this.players.forEach(player => player.node.active = false);
        this.setGameRound(0);
        this.resetDataAndUI();
    }
    //#endregion

    //#region Private Methods
    resetDataAndUI() {
        super.resetDataAndUI();

        this.roundResult.node.active = false;
        this.timeWaitNode.active = false;
        this.animatedTime.node.active = false;
    }

    regEvent(show: boolean) {
        var data = {
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
        var total = 0;
        for (var i = 0; i <= index; i++) {
            total += numberArray[i];
        }
        return total;
    }

    public getResults(settlementResult: any): string[] {
        var results = [];
        Object.keys(settlementResult).forEach((key, index) => {
            if (settlementResult[key]) {
                results.push(key);
            }
        })
        return results;
    }
    //#endregion
}