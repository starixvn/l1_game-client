import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import ProcessingWarning from "../../../common/processing-warning/view-models/ProcessingWarning";
import * as helper from '../../../common/helpers/Helper';
import DataHandler from "../../../common/_base/view-models/DataHandler";
import { GameConfigs } from "./RongHoConfigs";
import UmWarning from "../../../common/um-warning/UmWarning";
import UMDataHandler from "../view-models/handlers/UMDataHandler";
import GameTimeHandler from "../view-models/handlers/GameTimeHandler";
import BetDataHandler from "../view-models/handlers/BetDataHandler";
import FinishDataHandler from "./handlers/FinishDataHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHo extends cc.Component {

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    bet: cc.Node = null;

    @property(cc.Node)
    notice: cc.Node = null;

    @property(UmWarning)
    umNotice: UmWarning = null;

    @property(cc.Prefab)
    processWarningPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    prefabNotice: cc.Prefab = null;

    public config: GameConfigs
    public currentTimeRemaining: number;
    public disabledGame = false;

    private dataHandlers: DataHandler[] = []
    private gameName: string;
    private miniPanel: MiniPanel;
    private processingWarning: ProcessingWarning;
    private touchOffset = cc.v2(0, 0);
    private waitingCuoc = false;
    private timeInterval: number
    private statusTimeout: number;
    private cuoc: any;

    //#region Public Methods
    public init(miniPanel: MiniPanel, name: string, config: GameConfigs) {
        this.miniPanel = miniPanel; // MiniPanel
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

        this.initChangerBet();
        this.initDataHanders();
    }

    public onCuocClick(e) {
        if (this.disabledGame) {
            return;
        }
        if (this.waitingCuoc) {
            this.showWarningSlowBet(true);
            return;
        }

        this.waitingCuoc = true;
        //send cuoc
        var data = {
            cuoc: { cuoc: this.cuoc, box: e.name }
        }
        this.sendData(data);
    }

    public showUMWarning(data: any) {
        this.onGameHide();
        this.umNotice.show(data);
    }

    public changerBet(event, bet) {
        this.cuoc = bet;
        var target = event.target;
        this.updateSelectedBet(target.name);
        cc.RedT.setting[this.gameName].bet = target.name;
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

    public pressedTopDialog() {
        cc.RedT.audio.playClick();

        // var dialog = cc.instantiate(this.topDialog);
        // this.miniPanel.dialog.insertChild(dialog);
        // this.Top = dialog.getComponent("BauCuaTop");
        // this.Top.init(this);
    }

    public pressedHistoryDialog() {
        cc.RedT.audio.playClick();

        // var dialog = cc.instantiate(this.historyDialog);
        // this.miniPanel.dialog.insertChild(dialog);
        // this.LichSu = dialog.getComponent("BauCuaHistory");
        // this.LichSu.init(this);
    }

    public pressedShowGuide() {
        cc.RedT.audio.playClick();
        this.miniPanel.openGuide("BauCua");
    }
    //#endregion

    //#region Component Methods
    onDestroy() {
        cc.RedT.removeDataObserver(this.gameName);
    }

    onLoad() {
        cc.RedT.addDataObserver(this.gameName, this.receivedData.bind(this));
    }

    onEnable() {
        this.regEvent(true);
        this.background.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.background.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    onDisable() {
        this.onGameHide();

        this.regEvent(false);
        this.background.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.background.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.background.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
        cc.game.off(cc.game.EVENT_HIDE, this.onGameHide, this);
    }
    //#endregion

    //#region Private Methods
    initDataHanders() {
        var handlers = [
            new UMDataHandler(this),
            new GameTimeHandler(this),
            new BetDataHandler(this),
            new FinishDataHandler(this),
        ];
        this.dataHandlers.push(...handlers);
    }

    onGameShow() {
        this.regEvent(true);
    }

    onGameHide() {
        //clearInterval, reset state UI to default
        this.timeInterval && clearInterval(this.timeInterval);
        this.statusTimeout && clearTimeout(this.statusTimeout);
    }

    onSignIn() {
        if (!this.node.active) {
            return;
        }

        this.regEvent(true);
    }

    regEvent(show: boolean) {
        var data = {
            view: true,
            getLogs: true
        }
        this.sendData(data);
    }

    eventStart(e) {
        this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
        this.touchOffset = cc.v2(
            e.touch.getLocationX() - this.node.position.x,
            e.touch.getLocationY() - this.node.position.y
        );
    }

    eventMove(e) {
        this.node.position = cc.v2(
            e.touch.getLocationX() - this.touchOffset.x,
            e.touch.getLocationY() - this.touchOffset.y
        );
    }

    eventEnd() {
        cc.RedT.setting[this.gameName].position = this.node.position;
    }

    initChangerBet() {
        this.cuoc = cc.RedT.setting[this.gameName].bet;
        this.updateSelectedBet(cc.RedT.setting[this.gameName].bet);
    }

    updateSelectedBet(targetName) {
        this.bet.children.map(function (obj) {
            if (obj.name == targetName) {
                obj.children[0].active = true;
                obj.zIndex = 2;
                cc.tween(obj)
                    .to(0.2, {
                        scale: 1.15,
                        position: cc.v2(obj.position.x, 12)
                    })
                    .start();
            } else {
                obj.children[0].active = false;
                obj.zIndex = 1;
                cc.tween(obj)
                    .to(0.2, {
                        scale: 1,
                        position: cc.v2(obj.position.x, 0)
                    })
                    .start();
            }
        })
    }

    sendData(payload: any) {
        cc.RedT.send({
            g: {
                [this.gameName]: payload
            }
        });
    }

    showWarningSlowBet(show) {
        if (show) {
            if (this.processingWarning !== null) { return; }
            var node = cc.instantiate(this.processWarningPrefab);
            this.node.addChild(node);
            this.processingWarning = node.getComponent("ProcessingWarning");
        } else {
            if (this.processingWarning === null) { return; }
            this.processingWarning.close();
            this.processingWarning = null;
        }
    }

    addNotice(text) {
        var notice = cc.instantiate(this.prefabNotice);
        var noticeComponent = notice.getComponent("mini_warning");
        noticeComponent.text.string = text;
        this.notice.addChild(notice);
    }

    //#endregion Private Methods

    //#region Game Methods
    receivedData(data) {
        if (data.mini && data.mini[this.gameName]) {
            this.onData(data.mini[this.gameName]);
        }
    }

    onData(data: any) {
        this.dataHandlers.forEach(handler => handler.handle(data));
    }

    public playTime() {
        this.timeInterval && clearInterval(this.timeInterval);
        this.timeInterval = setInterval(function () {
            const isInWaitTime = cc.RedT.setting[this.gameName].time_remain > this.config.betTime;
            if (isInWaitTime) {
                let time = helper.numberPad(
                    cc.RedT.setting[this.gameName].time_remain - (this.config.betTime + 1),
                    2
                );

            } else {
                //clear effect for result

                const isStartingNewTurn = cc.RedT.setting[this.gameName].time_remain == this.config.betTime;
                if (isStartingNewTurn) {
                    //reset for new turn

                }

                const isInTurnTime = cc.RedT.setting[this.gameName].time_remain > 1;
                if (isInTurnTime) {
                    let time = helper.numberPad(
                        cc.RedT.setting[this.gameName].time_remain - 1,
                        2
                    );


                } else {
                    clearInterval(this.timeInterval);
                }
            }
            cc.RedT.setting[this.gameName].time_remain--;
        }.bind(this),
            1000
        );
    }

    private status(data: any) {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }
        this.statusTimeout = setTimeout(
            function () {
                if (data.win) {
                    this.addFlyingText(data.win, data.bet, 4);
                    cc.RedT.send({
                        user: {
                            updateCoint: true
                        }
                    });
                }

                if (void 0 !== data.thuong && data.thuong > 0) {
                    var thuong = new cc.Node().addComponent(cc.Label);
                    thuong.string = "+" + helper.numberWithCommas(data.thuong);
                    thuong.font = cc.RedT.util.fontEffect;
                    thuong.lineHeight = 90;
                    thuong.fontSize = 14;
                    this.notice.addChild(thuong.node);
                    thuong.node.runAction(
                        cc.sequence(
                            cc.moveTo(3, cc.v2(0, 100)),
                            cc.callFunc(function () {
                                this.node.destroy();
                            }, thuong)
                        )
                    );
                }
            }.bind(this),
            2e3
        );
    }
    //#endregion
}
