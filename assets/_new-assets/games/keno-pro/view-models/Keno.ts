import * as helper from '../../../common/helpers/Helper';
import GameRoomBase from "../../_base/GameRoomBase";
import KenoTimeHandler from './handlers/KenoTimeHandler';
import KenoFinishHandler from './handlers/KenoFinishHandler';
import { KenoConfigs } from './KenoConfigs';
import KenoNumber from './KenoNumber';
import KenoUserHistory from './history/KenoUserHistory';
import RoundHistory from './RoundHistory';
import KenoLogsHandler from './handlers/KenoLogsHandler';
import KenoUserHistoryHandler from './handlers/KenoUserHistoryHandler';

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

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    public resultAnimating = false;
    public kenoNumbers: KenoNumber[] = [];
    public history: KenoUserHistory;

    constructor() {
        super();
        this.finishHandler = new KenoFinishHandler(this);
        this.timeHandler = new KenoTimeHandler(this);
        this.logsHandler = new KenoLogsHandler(this);
        this.historyHandler = new KenoUserHistoryHandler(this);

        this.init("kenoProMax", new KenoConfigs());
    }

    //#region Public Methods
    public onCuocClick(e) {
        if (this.disabledGame) {
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
        this.history = dialog.getComponent("KenoUserHistory");
        this.history.init(this);
        this.node.addChild(dialog);
    }

    public hideHistoryDialog() {
        this.history = null;
    }

    public pressedShowGuide() {
        cc.RedT.audio.playClick();
        let dialog = cc.instantiate(this.guidePrefab);
        this.node.addChild(dialog);
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
        this.defaultUIState();
    }
    //#endregion

    //#region Private Methods
    stopGame() {
        super.stopGame();
        this.defaultUIState();
    }

    defaultUIState() {
        this.resultFrame.active = false;
        this.timeWaitNode.active = false;
        this.animatedTime.node.active = false;
        this.betItems.forEach(item => {
            item.clearBet();
            item.resetHighlight();
        });
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
    // receivedData(data) {
    //     if (data.mini && data.mini[this.gameName]) {
    //         this.onData(data.mini[this.gameName]);
    //     }
    // }

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

    public getResults(resultNumbers: number[]): string[] {
        var results = [];
        if (resultNumbers.length <= 0) {
            return results;
        }

        var total = this.getTempTotal(resultNumbers, resultNumbers.length - 1);

        if (total > 810) {
            results.push("big");
        } else {
            results.push("small");
        }

        if (total % 2 === 1) {
            results.push("odd");
        } else {
            results.push("even");
        }

        if (total < 696) {
            results.push("metal");
        } else if (total < 764) {
            results.push("wood");
        } else if (total < 856) {
            results.push("water");
        } else if (total < 1411) {
            results.push("fire");
        } else {
            results.push("earth");
        }
        return results;
    }
    //#endregion
}