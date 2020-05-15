import * as _ from 'lodash';
import DataHandler from "./handlers/DataHandler";
import UmWarning from "../../common/um-warning/UmWarning";
import { GameBaseConfigs } from "./GameBaseConfig";
import GameBaseUmDataHandler from "./handlers/GameBaseUmHandler";
import GameBaseNoticeHandler from "./handlers/GameBaseNoticeHandler";
import GameBaseStatusHandler from "./handlers/GameBaseStatusHandler";
import GameBaseBetHandler from "./handlers/GameBaseBetHandler";
import AnimatedTime from "../../common/animated-time/view-models/AnimatedTime";
import BetItem from "./BetItem";
import GameUtils from "../../common/GameUtils";
import GameBaseTimeHandler, { IGameBaseTimeHandler } from "./handlers/GameBaseTimeHandler";
import GameBaseErrorHandler from "./handlers/GameBaseErrorHandler";
import BetChips from "../../common/bet-chips/view-models/BetChips";
import GameBaseLogsHandler from "./handlers/GameBaseLogsHandler";
import GameBaseFinishHandler from "./handlers/GameBaseFinishHandler";
import IGameBaseStatusHandler from "./handlers/GameBaseStatusHandler";
import GameAudios from './GameAudios';

const { ccclass, property } = cc._decorator;

export enum GameState {
    None = 0,
    Started,
    Stopped,
}

@ccclass
export default class GameBase extends cc.Component {
    @property({ type: BetItem })
    betItems: BetItem[] = [];

    @property(cc.Prefab)
    processWarningPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    miniNoticePrefab: cc.Prefab = null;

    @property(cc.Node)
    noticeNode: cc.Node = null;

    @property(UmWarning)
    umNotice: UmWarning = null;

    @property(cc.Node)
    timeWaitNode: cc.Node = null;

    @property(cc.Label)
    timeWaitLabel: cc.Label = null;

    @property({ type: AnimatedTime })
    animatedTime: AnimatedTime = null;

    @property(cc.Label)
    gameRound: cc.Label = null;

    @property
    enableChips: boolean = false;

    @property({ type: cc.Node, visible: function (this: GameBase) { return this.enableChips; } })
    betChipsContainer: cc.Node = null;

    @property({ type: cc.Prefab, visible: function (this: GameBase) { return this.enableChips; } })
    betChipsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    gameAudiosPrefab: cc.Prefab = null;

    public gameState = GameState.None;
    public get isStopGame() { return this.gameState === GameState.Stopped; }
    public waitingProcessing = false;
    public currentTimeRemaining: number;
    public config: GameBaseConfigs;
    public gameName: string;
    public currentDataLogs = [];
    public roundId = -1;

    public umHandler: DataHandler;
    public noticeHandler: DataHandler;
    public statusHandler: IGameBaseStatusHandler;
    public betHandler: DataHandler;
    public timeHandler: IGameBaseTimeHandler;
    public errorHandler: DataHandler;
    public logsHandler: DataHandler;
    public finishHandler: DataHandler;

    public betChips: BetChips;
    public currentBet: number;
    public gameAudios: GameAudios;
    private dataHandlers: DataHandler[] = [];
    private processingWarning: cc.Node;

    constructor() {
        super();

        this.umHandler = new GameBaseUmDataHandler(this);
        this.noticeHandler = new GameBaseNoticeHandler(this);
        this.statusHandler = new GameBaseStatusHandler(this);
        this.betHandler = new GameBaseBetHandler(this);
        this.timeHandler = new GameBaseTimeHandler(this);
        this.errorHandler = new GameBaseErrorHandler(this);
        this.logsHandler = new GameBaseLogsHandler(this);
        this.finishHandler = new GameBaseFinishHandler(this);
    }

    init(gameName: string, config: GameBaseConfigs) {
        this.gameName = gameName;
        this.config = config;
    }

    onLoad() {
        this.addHandlers(
            this.umHandler,
            this.noticeHandler,
            this.statusHandler,
            this.betHandler,
            this.timeHandler,
            this.errorHandler,
            this.logsHandler,
            this.finishHandler);
        this.initBetChips();
        this.initGameAudios();
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    onDestroy() {
        cc.game.off(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
        this.timeHandler.stopPlayTime();
        this.statusHandler.clearTimeout();
    }

    onEnable() {
        this.startGame();
    }

    onDisable() {
        this.stopGame();
    }

    onData(data: any) {
        for (let index = 0; index < this.dataHandlers.length; index++) {
            let handler = this.dataHandlers[index];
            if (index == 0 && handler.handle(data)) { //um handler
                break;
            } else {
                handler.handle(data);
            }
        }
    }

    openGame() {
        cc.RedT.audio.playClick();
        this.node.active = true;
    }

    closeGame() {
        cc.RedT.audio.playUnClick();
        this.node.active = false;
    }

    showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.noticeNode, false, bet, 1);
    }

    showWinningBet(bet: number) {
        GameUtils.addFlyingText(this.noticeNode, true, bet, 1);
    }

    setGameRound(gameRound) {
        if (gameRound) {
            this.gameRound.string = "#" + gameRound;
        }
    }

    showProcessingWarning(show: boolean) {
        if (show) {
            if (this.processingWarning && this.processingWarning.isValid) { return; }
            var node = cc.instantiate(this.processWarningPrefab);
            this.node.addChild(node);
            this.processingWarning = node;
        } else {
            this.waitingProcessing = false;
            if (!this.processingWarning || !this.processingWarning.isValid) { return; }
            this.processingWarning.getComponent("ProcessingWarning").close();
            this.processingWarning = null;
        }
    }

    showUmMessage(data: any) {
        if (this.gameState == GameState.Stopped) {
            return;
        }

        this.umNotice && this.umNotice.show(data);
    }

    hideUmMessage() {
        this.umNotice && this.umNotice.hide();
    }

    showMiniWarning(data) {
        var notice = cc.instantiate(this.miniNoticePrefab);
        var noticeComponent = notice.getComponent("mini_warning");
        noticeComponent.text.string = data;
        this.noticeNode.addChild(notice);
    }

    /** Clear all intervals and timeouts in game */
    stopGame() {
        this.gameState = GameState.Stopped;
        this.timeHandler.stopPlayTime();
        this.resetDataAndUI();
    }

    /** Register with game on server */
    protected startGame() {
    }

    resetDataAndUI() {
        _.forEach(this.betItems, item => {
            item.clearBet();
            item.resetHighlight();
        });

        this.statusHandler.currentStatusData = null;
    }

    protected onGameHide() {
        this.stopGame();
    }

    protected onGameShow() {
        this.startGame();
    }

    protected bet(betData) {
        if (this.isStopGame) {
            return;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
        }
        else {
            this.waitingProcessing = true;
            this.sendData(betData);
        }
    }

    public sendData(payload: any) {
        cc.RedT.send({
            g: {
                [this.gameName]: payload
            }
        });
    }

    protected initBetChips() {
        if (this.enableChips) {
            var betChipsNode = cc.instantiate(this.betChipsPrefab);
            this.betChips = betChipsNode.getComponent("BetChips") as BetChips;
            var self = this;
            this.betChips.init((bet) => {
                self.currentBet = parseInt(bet);
            });
            this.betChipsContainer.addChild(betChipsNode);

        }
    }

    protected initGameAudios() {
        var gameAudiosNode = cc.instantiate(this.gameAudiosPrefab);
        this.gameAudios = gameAudiosNode.getComponent("GameAudios") as GameAudios;
    }

    protected addHandlers(...handlers: DataHandler[]): void {
        this.dataHandlers.push(...handlers);
    }
}
