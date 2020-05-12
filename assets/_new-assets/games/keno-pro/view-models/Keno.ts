import GameRoomBase from "../../_base/GameRoomBase";
import KenoTimeHandler from './handlers/KenoTimeHandler';
import KenoFinishHandler from './handlers/KenoFinishHandler';
import { KenoConfigs } from './KenoConfigs';
import KenoNumber from './KenoNumber';
import RoundHistory from './RoundHistory';
import KenoLogsHandler from './handlers/KenoLogsHandler';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Keno extends GameRoomBase {

    @property(cc.Node)
    resultFrame: cc.Node = null;

    @property(cc.Label)
    totalResult: cc.Label = null;

    @property(cc.Node)
    resultNumberNode: cc.Node = null;

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
        this.finishHandler = new KenoFinishHandler(this);
        this.timeHandler = new KenoTimeHandler(this);
        this.logsHandler = new KenoLogsHandler(this);

        this.init("kenoProMax", new KenoConfigs());
    }

    //#region Public Methods
    public onCuocClick(e) {
        if (this.isStopGame) {
            return;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
            return;
        }

        this.waitingProcessing = true;
        var data = {
            cuoc: { cuoc: this.currentBet, box: e.target.name }
        }
        this.sendData(data);
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

        this.roundHistory.init(this);
        this.players.forEach(player => player.node.active = false);
        this.kenoNumbers = this.resultNumberNode.children.map(child => child.getComponent(KenoNumber));
        this.setGameRound(0);
        this.resetDataAndUI();
        this.setOdds();
    }
    //#endregion

    //#region Private Methods
    resetDataAndUI() {
        super.resetDataAndUI();

        this.resultFrame.active = false;
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
    private setOdds() {
        var oddData = {
            big: 1.97,
            small: 1.97,
            even: 1.97,
            odd: 1.97,
            gold: 9.2,
            wood: 4.6,
            water: 2.4,
            fire: 4.6,
            earth: 9.2
        };
        this.betItems.forEach(item => item.setOdd(oddData[item.node.name]));
    }

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
        Object.keys(settlementResult).forEach(key => {
            if (settlementResult[key]) {
                results.push(key);
            }
        })
        return results;
    }
    //#endregion
}