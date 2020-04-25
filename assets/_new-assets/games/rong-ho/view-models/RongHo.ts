import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import ProcessingWarning from "../../../common/processing-warning/view-models/ProcessingWarning";
import * as helper from '../../../common/helpers/Helper';
import DataHandler from "../../../common/_base/view-models/DataHandler";
import { GameConfigs } from "./RongHoConfigs";
import UmWarning from "../../../common/um-warning/UmWarning";
import RHUMDataHandler from "./handlers/RHUMDataHandler";
import RHGameTimeHandler from "./handlers/RHGameTimeHandler";
import RHBetDataHandler from "./handlers/RHBetDataHandler";
import RHFinishDataHandler from "./handlers/RHFinishDataHandler";
import RongHoBetItem from "./RongHoBetItem";
import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import RHNoticeHandler from "./handlers/RHNoticeHandler";
import RHBetStatusDataHandler from "./handlers/RHBetStatusDataHandler";
import GameUtils from "../../../common/GameUtils";
import RHLogsDataHandler from "./handlers/RHLogsDataHandler";
import RongHoHistory from "./history/RongHoHistory";
import RHHistoryDataHandler from "./handlers/RHHistoryDataHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHo extends cc.Component {

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    bet: cc.Node = null;

    @property(cc.Node)
    notice: cc.Node = null;

    @property(AnimatedTime)
    animatedTime: AnimatedTime = null;

    @property(cc.Label)
    waitTime: cc.Label = null;

    @property(cc.Label)
    phienLabel: cc.Label = null;

    @property(cc.Label)
    dragonOdd: cc.Label = null;

    @property(cc.Label)
    tigerOdd: cc.Label = null;

    @property(cc.Label)
    drawOdd: cc.Label = null;

    @property(cc.Label)
    dragonStats: cc.Label = null;

    @property(cc.Label)
    tigerStats: cc.Label = null;

    @property(cc.Label)
    drawStats: cc.Label = null;

    @property(cc.Node)
    logsContainer: cc.Node = null;

    @property({ type: cc.SpriteFrame })
    dotSprites: cc.SpriteFrame[] = [];

    @property({ type: RongHoBetItem })
    betItems: RongHoBetItem[] = [];

    @property({ type: cc.Sprite })
    cards: cc.Sprite[] = [];

    @property(cc.SpriteAtlas)
    cardAtlas: cc.SpriteAtlas = null;

    @property(UmWarning)
    umNotice: UmWarning = null;

    @property(cc.Prefab)
    processWarningPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    prefabNotice: cc.Prefab = null;

    @property(cc.Prefab)
    prefabHistory: cc.Prefab = null;

    public config: GameConfigs
    public currentTimeRemaining: number;
    public disabledGame = false;
    public waitingCuoc = false;
    public phienId = -1;
    public resultCards = [];
    public logs = [];
    public history: RongHoHistory;

    private dots: cc.Sprite[];
    private dataHandlers: DataHandler[] = []
    private gameName: string;
    private miniPanel: MiniPanel;
    private processingWarning: ProcessingWarning;
    private touchOffset = cc.v2(0, 0);
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
        this.initDataHandlers();
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
            cuoc: { cuoc: this.cuoc, box: e.target.name }
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

    public pressedHistoryDialog() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.prefabHistory);
        this.history = dialog.getComponent("RongHoHistory");
        this.history.init(this);
        this.miniPanel.dialog.insertChild(dialog, 0);
    }

    public hideHistory() {
        this.history = null;
    }

    public pressedShowGuide() {
        cc.RedT.audio.playClick();
        this.miniPanel.openGuide("RongHo");
    }
    //#endregion

    //#region Component Methods
    onDestroy() {
        cc.RedT.removeDataObserver(this.gameName);
    }

    onLoad() {
        var logNodes = this.logsContainer.children.map((child, index) => {
            var sprites = child.children.map(item => {
                item.active = false;
                return item.getComponent(cc.Sprite);
            });
            if (index % 2 === 1) {
                sprites.reverse();
            }
            return sprites;
        });
        this.dots = [].concat.apply([], logNodes);
        this.setOddLabels();
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
    setOddLabels() {
        this.dragonOdd.string = "1:2";
        this.tigerOdd.string = "1:2";
        this.drawOdd.string = "1:11";
    }

    initDataHandlers() {
        var handlers = [
            new RHUMDataHandler(this),
            new RHGameTimeHandler(this),
            new RHBetDataHandler(this),
            new RHBetStatusDataHandler(this),
            new RHLogsDataHandler(this),
            new RHFinishDataHandler(this),
            new RHNoticeHandler(this),
            new RHHistoryDataHandler(this)
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
            view: show,
        }
        if (show) {
            data["getLogs"] = true;
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
                [`mini_${this.gameName}`]: payload
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

    private setPhienLabel(phien) {
        this.phienLabel.string = phien < 0 ? "" : `#${phien}`;
    }

    private showResultCards(show: boolean) {
        if (this.resultCards.length != 2 && show) {
            return;
        }

        if (show) {
            this.resultCards.forEach((data, index) => {
                this.cards[index].spriteFrame = cc.RedT.util.card.getCard(data.card, data.type);
            });
        } else {
            this.cards.forEach(card => card.spriteFrame = cc.RedT.util.card.cardB2);
        }
    }

    private getWinItem(cards): string {
        if (cards.length != 2) {
            return "";
        }

        var card1 = cards[0];
        var card2 = cards[1];
        if (card1.card > card2.card) {
            return "dragon";
        } else if (card1.card < card2.card) {
            return "tiger";
        } else {
            return "draw";
        }
    }

    private highlightWonItem(highlight: boolean) {
        if (highlight) {
            var winItem = this.getWinItem(this.resultCards);
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

        this.waitTime.string = time == "00" ? '' : "00:" + time;
        this.waitTime.node.parent.active = isInWaitTime && time != "00";

        this.animatedTime.setTime(time);
        this.animatedTime.node.parent.active = isInTurnTime;
    }

    public updateLogs() {
        if (this.logs.length == 0) {
            this.phienId = 1;
        } else {
            this.phienId = this.logs[0].round;
        }

        //update display logs
        var dragonCount = 0, tigerCount = 0, drawCount = 0;
        var self = this;
        this.logs.forEach((log, index) => {
            var cards = log.result;
            var winItem = self.getWinItem(cards);
            self.dots[index].node.active = true;
            switch (winItem) {
                case "dragon":
                    dragonCount++;
                    self.dots[index].spriteFrame = self.dotSprites[0];
                    break;
                case "draw":
                    drawCount++;
                    self.dots[index].spriteFrame = self.dotSprites[2];
                    break;
                case "tiger":
                    tigerCount++;
                    self.dots[index].spriteFrame = self.dotSprites[1];
                    break;
            }
        });

        var dragonStats = Math.floor(dragonCount * 100 / this.logs.length);
        var tigerStats = Math.floor(tigerCount * 100 / this.logs.length);
        var drawStats = 100 - (dragonStats + tigerStats);

        this.dragonStats.string = `${dragonStats}%`;
        this.tigerStats.string = `${tigerStats}%`;
        this.drawStats.string = `${drawStats}%`;
    }

    public playTime() {
        this.timeInterval && clearInterval(this.timeInterval);
        this.timeInterval = setInterval(function () {
            const isInWaitTime = this.currentTimeRemaining > this.config.betTime;
            const isInTurnTime = !isInWaitTime && this.currentTimeRemaining > 0;
            this.showTime(isInWaitTime, isInTurnTime);

            if (isInWaitTime) {
                //show result
                this.setPhienLabel(this.phienId);
                this.showResultCards(true);
                this.highlightWonItem(true);
            } else {
                //clear effect for result
                this.setPhienLabel(this.phienId + 1);
                this.showResultCards(false);
                this.highlightWonItem(false);

                const isStartingNewTurn = this.currentTimeRemaining == this.config.betTime;
                if (isStartingNewTurn) {
                    //reset for new turn
                    this.betItems.forEach(item => item.clear());
                }

                if (!isInTurnTime) {
                    clearInterval(this.timeInterval);
                }
            }
            this.currentTimeRemaining--;
        }.bind(this),
            1000
        );
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

    public showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.notice, false, bet, 1);
    }
    //#endregion
}
