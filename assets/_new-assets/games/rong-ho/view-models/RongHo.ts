import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import * as helper from '../../../common/helpers/Helper';
import DataHandler from "../../_base/handlers/DataHandler";
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
import { GameBaseConfigs } from "../../_base/GameBaseConfig";
import BetChips from "../../../common/bet-chips/view-models/BetChips";
import GameAudios from "../../_base/GameAudios";
import LogControl from "../../keno-pro/view-models/LogControl";
import RHRoundResultItem from "./RHRoundResultItem";
import MiniRoundHistory from "../../../common/mini-round-history/MiniRoundHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHo extends cc.Component {

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    betChipsContainer: cc.Node = null;

    @property(cc.Prefab)
    betChipsPrefab: cc.Prefab = null;

    @property(cc.Node)
    notice: cc.Node = null;

    @property(cc.Animation)
    resultAnimation: cc.Animation = null;

    @property(cc.Animation)
    drawAnimation: cc.Animation = null;

    @property(AnimatedTime)
    animatedTime: AnimatedTime = null;

    @property(cc.Label)
    waitTime: cc.Label = null;

    @property(cc.Node)
    resultFrame: cc.Node = null;

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

    @property({ type: RongHoBetItem })
    betItems: RongHoBetItem[] = [];

    @property({ type: cc.Sprite })
    cards: cc.Sprite[] = [];

    @property({ type: cc.Sprite })
    cardBacks: cc.Sprite[] = [];

    @property(cc.SpriteAtlas)
    cardAtlas: cc.SpriteAtlas = null;

    @property(UmWarning)
    umNotice: UmWarning = null;

    @property(cc.Prefab)
    processWarningPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    noticePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    cardsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    gameAudiosPrefab: cc.Prefab = null;

    @property(LogControl)
    logControl: LogControl = null;

    @property(MiniRoundHistory)
    miniRoundHistory: MiniRoundHistory = null;

    @property(cc.Node)
    scoreBoard: cc.Node = null;

    @property(cc.AudioSource)
    audioDrawCard: cc.AudioSource = null;

    public config: GameBaseConfigs
    public currentTimeRemaining: number;
    public disabledGame = false;
    public waitingCuoc = false;
    public phienId = -1;
    public resultCards = [];
    public logs = [];
    public history: RongHoHistory;

    private dataHandlers: DataHandler[] = [];
    private gameName: string;
    private miniPanel: MiniPanel;
    private processingWarning: cc.Node;
    private touchOffset = cc.v2(0, 0);
    private timeInterval: number;
    private statusTimeout: number;
    private cuoc: any;
    private resultAnimating = false;
    private cardsUtil: any;
    private betChips: BetChips = null;
    private gameAudios: GameAudios;

    //#region Public Methods
    public init(miniPanel: MiniPanel, name: string, config: GameBaseConfigs) {
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
        cc.RedT.audio.playClick();
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

    public changerBet(bet) {
        this.cuoc = bet;
        cc.RedT.setting[this.gameName].bet = bet;
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

        var dialog = cc.instantiate(this.historyPrefab);
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

    public pressedShowScoreBoard() {
        cc.RedT.audio.playClick();
        this.scoreBoard.active = !this.scoreBoard.active;
    }
    //#endregion

    //#region Component Methods
    onDestroy() {
    }

    onLoad() {
        this.setOddLabels();
        this.setPhienLabel(0);
        this.initCards();
        this.animatedTime.node.active = false;
        this.initGameAudios();
        const condition = () => {
            return this.currentTimeRemaining < this.config.stopBetTime || this.currentTimeRemaining > this.config.fullTime - this.resultAnimation.defaultClip.duration;
        };
        this.logControl.init(condition);
    }

    private initGameAudios() {
        var gameAudiosNode = cc.instantiate(this.gameAudiosPrefab);
        this.gameAudios = gameAudiosNode.getComponent("GameAudios") as GameAudios;
    }

    private initCards() {
        var cardsNode = cc.instantiate(this.cardsPrefab);
        this.cardsUtil = cardsNode.getComponent("Card");
        this.cardsUtil.init();
    }

    onEnable() {
        this.resultAnimation.on("finished", () => {
            this.showResult(true);
        }, this);
        this.cardBacks.forEach(back => back.node.scale = 1);
        cc.RedT.addDataObserver(this.gameName, this.receivedData.bind(this));
        this.regEvent(true);
        this.background.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.background.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    onDisable() {
        this.resultAnimation.stop();
        this.drawAnimation.stop();
        this.resultAnimation.off("finished");
        cc.RedT.removeDataObserver(this.gameName);
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
        this.defaultUIState();
    }

    defaultUIState() {
        this.resultFrame.active = false;
        this.waitTime.node.parent.active = false;
        this.animatedTime.node.parent.active = false;
        this.betItems.forEach(item => {
            item.clear();
            item.resetHighlight();
        });
        this.cards.forEach(card => card.node.active = false);
        this.notice.children.forEach(child => child.destroy());
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
        this.betChips = cc.instantiate(this.betChipsPrefab).getComponent(BetChips);
        this.betChipsContainer.addChild(this.betChips.node);
        this.betChips.init((bet) => this.changerBet(bet));
        this.cuoc = cc.RedT.setting[this.gameName].bet;
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
            if (this.processingWarning && this.processingWarning.isValid) { return; }
            var node = cc.instantiate(this.processWarningPrefab);
            this.node.addChild(node);
            this.processingWarning = node;
        } else {
            if (!this.processingWarning || !this.processingWarning.isValid) { return; }
            this.processingWarning.getComponent("ProcessingWarning").close();
            this.processingWarning = null;
        }
    }

    addNotice(text) {
        var notice = cc.instantiate(this.noticePrefab);
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
        //this.dataHandlers.forEach(handler => handler.handle(data));
        for (let index = 0; index < this.dataHandlers.length; index++) {
            let handler = this.dataHandlers[index];
            if (index == 0 && handler.handle(data)) {
                break;
            } else {
                handler.handle(data);
            }
        }
    }

    private setPhienLabel(phien) {
        this.phienLabel.string = phien < 1 ? "" : `#${phien}`;
    }

    private showResultCards(show: boolean) {
        if (this.resultCards.length != 2 && show) {
            return;
        }

        if (show) {
            this.resultCards.forEach((data, index) => {
                var card = this.cards[index];
                card.node.active = true;
                card.node.scaleX = 1;
                card.spriteFrame = this.cardsUtil.getCard(data.card, data.type);
            });
        } else {
            this.cards.forEach((card, index) => {
                card.node.scaleX = 0;
                card.spriteFrame = this.cardsUtil.cardB2;
            });
        }
    }

    private updateResultCards() {
        if (this.resultCards.length != 2) {
            return;
        }

        this.resultCards.forEach((data, index) => {
            var card = this.cards[index];
            card.spriteFrame = this.cardsUtil.getCard(data.card, data.type);
        });
    }

    public static getWinItem(cards: { card: number, type: number }[]): number {
        if (cards.length != 2) {
            return -1;
        }

        var card1 = cards[0];
        var card2 = cards[1];
        if (card1.card > card2.card) {
            return 0;
        } else if (card1.card < card2.card) {
            return 1;
        } else {
            return 2;
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

    public updateLogs() {
        if (this.logs.length == 0) {
            this.phienId = 1;
        } else {
            this.phienId = this.logs[0].round;
        }

        //update display logs
        let dragonCount = 0, tigerCount = 0, drawCount = 0;

        const logControlData = [];
        const result = [];
        this.logs.forEach((log, index) => {
            let cards = log.result;
            let winItem = RongHo.getWinItem(cards);
            result.push(winItem);

            switch (winItem) {
                case 0:
                    dragonCount++;
                    break;
                case 1:
                    tigerCount++;
                    break;
                case 2:
                    drawCount++;
                    break;
            }
        });

        let count = 0;
        for (let i = 0; i < result.length;) {
            if (result[i] == 2)//draw
            {
                count++;
                if (i == result.length - 1) { // show special last item
                    logControlData.push({ item: 2, draw: count });
                }
            } else {
                logControlData.push({
                    item: result[i],
                    draw: count
                })
                count = 0;
            }
            i++;
        }
        this.miniRoundHistory.setData(this.logs);

        logControlData.reverse();
        this.logControl.setData(logControlData.map(d => d.item));
        const items = this.logControl.content.getComponentsInChildren(RHRoundResultItem);
        items.forEach((item, index) => item.setValue(logControlData[index].draw));

        var dragonStats = Math.floor(dragonCount * 100 / this.logs.length);
        var drawStats = Math.floor(drawCount * 100 / this.logs.length);
        var tigerStats = 100 - (dragonStats + drawStats);

        this.dragonStats.string = `${dragonStats}%`;
        this.tigerStats.string = `${tigerStats}%`;
        this.drawStats.string = `${drawStats}%`;
    }

    public showResult(show: boolean) {
        if (show) {
            this.updateLogs();
            this.setPhienLabel(this.phienId);
            this.showResultCards(true);

            const betChoice = ["dragon", "tiger", "tie"];
            const choiceWin = RongHo.getWinItem(this.resultCards);
            var winItem = betChoice[choiceWin];
            if (winItem != "") {
                this.gameAudios.playShowResultAudio();
                this.resultFrame.active = true;
                this.resultFrame.children.forEach(child => child.active = child.name == winItem);
                this.highlightWonItem(true, winItem);
            }
        } else {
            this.setPhienLabel(this.phienId + 1);
            this.showResultCards(false);
            this.highlightWonItem(false);
            this.resultFrame.active = false;
        }
    }

    public playAnimationResult() {
        this.animatedTime.node.parent.active = false;
        this.updateResultCards();
        this.resultAnimation.play();
        this.resultAnimating = true;
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
                    this.drawAnimation.play();
                    this.audioDrawCard.setCurrentTime(.2);
                    this.audioDrawCard.play();
                    cc.tween(this)
                        .delay(0.2)
                        .call(() => {
                            this.audioDrawCard.stop();
                            this.audioDrawCard.setCurrentTime(.2);
                            this.audioDrawCard.play();
                        })
                        .delay(.2)
                        .call(() => {
                            this.audioDrawCard.stop();
                        })
                        .start();
                }
            } else {
                //clear effect for result
                this.resultAnimating = false;
                this.showResult(false);
                const isStartingNewTurn = this.currentTimeRemaining == this.config.betTime;

                if (isStartingNewTurn) {
                    //reset for new turn
                    this.betItems.forEach(item => item.clear());
                    this.notice.children.forEach(child => child.destroy());
                    this.gameAudios.playStartGameAudio();
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

    public showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.notice, false, bet, 1);
    }
    //#endregion
}
