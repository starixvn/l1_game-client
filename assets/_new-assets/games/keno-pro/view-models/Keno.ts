import * as helper from '../../../common/helpers/Helper';
import GameRoomBase from "../../_base/GameRoomBase";
import KenoTimeHandler from './handlers/KenoTimeHandler';
import KenoFinishHandler from './handlers/KenoFinishHandler';
import { KenoConfigs } from './KenoConfigs';
import KenoNumber from './KenoNumber';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Keno extends GameRoomBase {

    @property(cc.Node)
    resultFrame: cc.Node = null;

    @property(cc.Label)
    totalResult: cc.Label = null;

    @property(cc.Node)
    resultNumberNode: cc.Node = null;

    @property(cc.Prefab)
    prefabHistory: cc.Prefab = null;

    private resultAnimating = false;
    private kenoNumbers: KenoNumber[] = [];

    constructor() {
        super();
        this.finishHandler = new KenoFinishHandler(this);
        this.timeHandler = new KenoTimeHandler(this);

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

        // var dialog = cc.instantiate(this.prefabHistory);
        // this.history = dialog.getComponent("RongHoHistory");
        // this.history.init(this);
        // this.miniPanel.dialog.insertChild(dialog, 0);
    }

    public pressedShowGuide() {
        cc.RedT.audio.playClick();
        // this.miniPanel.openGuide("RongHo");
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
    public playResultAnimation() {
        var resultNumbers = this.currentDataLogs[0].result;
        this.resultAnimating = true;
        this.resultFrame.active = true;
        this.totalResult.string = "0";
        this.kenoNumbers.forEach(keno => keno.show(false));
        var i = 0;
        var sequence = cc.sequence(
            cc.callFunc(() => {
                this.kenoNumbers[i].setNumber(resultNumbers[i]);
                this.totalResult.string = this.getTempTotal(resultNumbers, i).toString();
                i++;
            }),
            cc.delayTime(0.1)
        );

        this.resultNumberNode.runAction(cc.sequence(
            cc.repeat(sequence, 20),
            cc.callFunc(() => this.resultAnimating = false)));
    }

    private getResults(): string[] {
        var results = [];
        var resultNumbers = this.currentDataLogs[0].result;
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

    private getTempTotal(numberArray: number[], index: number): number {
        var total = 0;
        for (var i = 0; i <= index; i++) {
            total += numberArray[i];
        }
        return total;
    }

    public handleWaitTime() {
        if (!this.resultAnimating) {
            this.showResult(true);
        }
    }

    public handleInTurnTime() {
        this.resultAnimating = false;
        this.showResult(false);
        const isStartingNewTurn = this.currentTimeRemaining == this.config.betTime;

        if (isStartingNewTurn) {
            this.betItems.forEach(item => item.clearBet());
        }
    }

    private highlightWonItem(highlight: boolean, results: string[] = []) {
        if (highlight) {
            this.betItems.forEach(item => {
                var exist = results.indexOf(item.node.name);
                item.setHighlight(exist > -1);
            });
        } else {
            this.betItems.forEach(item => item.resetHighlight());
        }
    }

    public showResult(show: boolean) {
        if (show) {
            // this.updateLogs();
            this.setGameRound(this.roundId);

            var results = this.getResults();
            if (results.length > 0) {
                this.resultFrame.active = true;
                this.highlightWonItem(true, results);
            }
        } else {
            this.setGameRound(this.roundId + 1);
            this.highlightWonItem(false);
            this.resultFrame.active = false;
        }
    }
    //#endregion
}
