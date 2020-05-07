import * as helper from '../../../common/helpers/Helper';
import BetChips from "../../../common/bet-chips/view-models/BetChips";
import GameRoomBase from "../../../common/game/GameRoomBase";
import KenoTimeHandler from './handlers/KenoTimeHandler';

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


    private cuoc: any;
    private resultAnimating = false;

    constructor() {
        super();
        this.timeHandler = new KenoTimeHandler(this);
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
            cuoc: { cuoc: this.cuoc, box: e.target.name }
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

        cc.RedT.setting[this.gameName] = cc.RedT.setting[this.gameName] || {
            regOpen: false,
            data: {
                //data cuoc
            },
            red: true,
            bet: "1"
        };

        if (void 0 !== cc.RedT.setting[this.gameName].position) {
            this.node.position = cc.RedT.setting[this.gameName].position;
        }

        this.initBetControl();
        this.setPhienLabel(0);
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

    initBetControl() {
        this.cuoc = cc.RedT.setting[this.gameName].bet;
        this.betChips.setCurrentBet(this.cuoc);
        this.betChips.onChanged = (bet) => {
            this.cuoc = bet;
            cc.RedT.setting[this.gameName].bet = bet;
        };
    }
    //#endregion Private Methods

    //#region Game Methods
    // receivedData(data) {
    //     if (data.mini && data.mini[this.gameName]) {
    //         this.onData(data.mini[this.gameName]);
    //     }
    // }

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
