import * as helper from '../../../common/helpers/Helper';
import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import GameUtils from "../../../common/GameUtils";
import BetControl from "../../../common/bet-control/view-models/BetControl";
import GameRoomBase from "../../../common/game/GameRoomBase";
import { GameBaseConfigs } from "../../../common/game/GameBaseConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Keno extends GameRoomBase {

    @property(AnimatedTime)
    animatedTime: AnimatedTime = null;

    @property(cc.Label)
    waitTime: cc.Label = null;

    @property(cc.Node)
    resultFrame: cc.Node = null;

    @property(cc.Label)
    phienLabel: cc.Label = null;

    @property(BetControl)
    betControl: BetControl = null;


    @property(cc.Prefab)
    prefabHistory: cc.Prefab = null;

    public config: GameBaseConfigs;
    public currentTimeRemaining: number;
    public disabledGame = false;
    public phienId = -1;
    public logs = [];

    private gameName: string;
    private timeInterval: number
    private statusTimeout: number;
    private cuoc: any;
    private resultAnimating = false;

    //#region Public Methods
    public init(name: string, config: GameBaseConfigs) {
        this.gameName = name;
        this.config = config;

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
        this.initDataHandlers();
    }

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

    public showUMWarning(data: any) {
        this.onGameHide();
        this.umNotice.show(data);
    }

    public openGame() {
        cc.RedT.audio.playClick();
        this.node.active = !0;
        cc.sys.localStorage.setItem(this.gameName, true);
    }

    public closeGame() {
        cc.RedT.audio.playUnClick();
        this.node.active = !1;
        cc.sys.localStorage.setItem(this.gameName, false);
    }

    public pressedHistoryDialog() {
        cc.RedT.audio.playClick();

        // var dialog = cc.instantiate(this.prefabHistory);
        // this.history = dialog.getComponent("RongHoHistory");
        // this.history.init(this);
        // this.miniPanel.dialog.insertChild(dialog, 0);
    }

    public hideHistory() {
        // this.history = null;
    }

    public pressedShowGuide() {
        cc.RedT.audio.playClick();
        // this.miniPanel.openGuide("RongHo");
    }
    //#endregion

    //#region Component Methods
    onDestroy() {
        super.onDestroy();
        cc.RedT.removeDataObserver(this.gameName);
    }

    onLoad() {
        super.onLoad()
        this.setPhienLabel(0);
        cc.RedT.addDataObserver(this.gameName, this.receivedData.bind(this));
    }

    onEnable() {
        this.regEvent(true);
    }

    onDisable() {
        this.onGameHide();
        this.regEvent(false);
    }
    //#endregion

    //#region Private Methods

    initDataHandlers() {
        super.initHandlers();
    }

    onGameShow() {
        this.regEvent(true);
    }

    onGameHide() {
        //clearInterval, reset state UI to default
        this.timeInterval && clearInterval(this.timeInterval);
        this.statusTimeout && clearTimeout(this.statusTimeout);
        this.defaultUIState();
    }

    defaultUIState() {
        this.resultFrame.active = false;
        this.waitTime.node.parent.active = false;
        this.animatedTime.node.parent.active = false;
        this.betItems.forEach(item => {
            item.clearBet();
            item.resetHighlight();
        });
    }

    onSignIn() {
        if (!this.node.active) {
            return;
        }

        this.regEvent(true);
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
        this.betControl.setCurrentBet(this.cuoc);
        this.betControl.onChanged = (bet) => {
            this.cuoc = bet;
            cc.RedT.setting[this.gameName].bet = bet;
        };
    }

    sendData(payload: any) {
        cc.RedT.send({
            g: {
                [`mini_${this.gameName}`]: payload
            }
        });
    }

    //#endregion Private Methods

    //#region Game Methods
    receivedData(data) {
        if (data.mini && data.mini[this.gameName]) {
            this.onData(data.mini[this.gameName]);
        }
    }

    onData(data: any) {
        super.onData(data);
    }

    goToLobby() {
        super.goToLobby();
    }

    private setPhienLabel(phien) {
        this.phienLabel.string = phien < 1 ? "" : `#${phien}`;
    }

    private showResultCards(show: boolean) {

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

    private showTime(isInWaitTime, isInTurnTime) {
        let time: any;
        if (isInWaitTime) {
            time = helper.numberPad(this.currentTimeRemaining - this.config.betTime, 2);
        } else {
            if (isInTurnTime) {
                time = helper.numberPad(this.currentTimeRemaining, 2);
            } else {
                time = 0;
            }
        }

        // this.waitTime.string = time == "00" ? '' : "00:" + time;
        // this.waitTime.node.parent.active = isInWaitTime && time != "00";

        this.animatedTime.setTime(time);
        this.animatedTime.node.parent.active = isInTurnTime && time != "00";
    }

    public showResult(show: boolean) {
        if (show) {
            // this.updateLogs();
            this.setPhienLabel(this.phienId);
            this.showResultCards(true);

            // var winItem = this.getWinItem(this.resultCards);
            // if (winItem != "") {
            //     this.resultFrame.active = true;
            //     this.resultFrame.children.forEach(child => child.active = child.name == winItem);
            //     this.highlightWonItem(true, winItem);
            // }
        } else {
            this.setPhienLabel(this.phienId + 1);
            this.showResultCards(false);
            this.highlightWonItem(false);
            this.resultFrame.active = false;
        }
    }

    public playTime() {
        this.timeInterval && clearInterval(this.timeInterval);
        this.timeInterval = setInterval(() => {
            const isInWaitTime = this.currentTimeRemaining > this.config.betTime;
            const isInTurnTime = !isInWaitTime && this.currentTimeRemaining > 0;
            this.showTime(isInWaitTime, isInTurnTime);
            if (isInWaitTime) {
                if (!this.resultAnimating) {
                    this.showResult(true);
                }
                if (this.currentTimeRemaining == this.config.betTime + 1) {
                    // this.resultAnimating = false; //comment for dont show result again after enable game.
                    this.showResult(false);
                    // this.drawAnimation.play();
                }
            } else {
                //clear effect for result
                this.resultAnimating = false;
                this.showResult(false);
                const isStartingNewTurn = this.currentTimeRemaining == this.config.betTime;

                if (isStartingNewTurn) {
                    //reset for new turn
                    this.betItems.forEach(item => item.clearBet());
                    this.notice.removeAllChildren();
                }

                if (!isInTurnTime) {
                    clearInterval(this.timeInterval);
                }
            }
            this.currentTimeRemaining--;
        }, 1000);
    }

    public status(win, bet) {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }
        this.statusTimeout = setTimeout(
            function () {
                if (win) {
                    GameUtils.addFlyingText(this.notice, win, bet, 4);
                    cc.RedT.send({
                        user: {
                            updateCoint: true
                        }
                    });
                }
            }.bind(this),
            2e3
        );
    }


    //#endregion
}
