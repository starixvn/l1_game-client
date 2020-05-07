import * as helper from '../../../common/helpers/Helper';
import GameRoomBase from "../../../common/game/GameRoomBase";
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

        this.init("KenoProMax", new KenoConfigs());
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
    }
    //#endregion

    //#region Private Methods
    stopGame() {
        super.stopGame();
        this.defaultUIState();
    }

    defaultUIState() {
        this.resultFrame.active = false;
        this.timeWaitLabel.node.parent.active = false;
        this.animatedTime.node.parent.active = false;
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
        this.resultAnimating = true;

        var numbers: number[];
        var i = 0;
        var sequence = cc.sequence(
            cc.callFunc(() => {
                this.kenoNumbers[i].setNumber(numbers[i]);
                this.totalResult.string = this.getTempTotal(numbers, i).toString();
                i++;
            }),
            cc.delayTime(0.1)
        );

        this.resultNumberNode.runAction(cc.repeat(sequence, 20));
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

    private highlightWonItem(highlight: boolean, winItem: string = "") {
        if (highlight) {
            if (winItem != "") {
                this.betItems.forEach(item => {
                    item.setHighlight(item.node.name == winItem);
                });
            }
        } else {
            this.betItems.forEach(item => item.resetHighlight());
        }
    }

    public showResult(show: boolean) {
        if (show) {
            // this.updateLogs();
            this.setGameRound(this.roundId);

            // var winItem = this.getWinItem(this.resultCards);
            // if (winItem != "") {
            //     this.resultFrame.active = true;
            //     this.resultFrame.children.forEach(child => child.active = child.name == winItem);
            //     this.highlightWonItem(true, winItem);
            // }
        } else {
            this.setGameRound(this.roundId + 1);
            this.highlightWonItem(false);
            this.resultFrame.active = false;
        }
    }
    //#endregion
}
