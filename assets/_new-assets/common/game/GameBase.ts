import DataHandler from "./handlers/DataHandler";
import UmWarning from "../um-warning/UmWarning";
import { GameBaseConfigs } from "./GameBaseConfig";
import GameBaseUmDataHandler from "./handlers/GameBaseUmHandler";
import GameBaseNoticeHandler from "./handlers/GameBaseNoticeHandler";
import GameBaseStatusHandler from "./handlers/GameBaseStatusHandler";
import GameBaseBetHandler from "./handlers/GameBaseBetHandler";
import AnimatedTime from "../animated-time/view-models/AnimatedTime";
import BetItem from "./BetItem";
import GameUtils from "../GameUtils";
import GameBaseTimeHandler, { IGameBaseTimeHandler } from "./handlers/GameBaseTimeHandler";
import GameBaseErrorHandler from "./handlers/GameBaseErrorHandler";

const { ccclass, property } = cc._decorator;

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

    public waitingProcessing = false;
    public disabledGame = false;
    public currentTimeRemaining: number;
    public config: GameBaseConfigs;
    public gameName: string;

    protected umHandler: DataHandler;
    protected noticeHandler: DataHandler;
    protected statusHandler: DataHandler;
    protected betHandler: DataHandler;
    protected timeHandler: IGameBaseTimeHandler;
    protected errorHandler: DataHandler;

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
            this.errorHandler);

        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    onDestroy() {
        cc.game.off(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
        this.timeHandler.stopPlayTime();
    }

    onEnable() {
        this.startGame();
    }

    onDisable() {
        this.stopGame();
    }

    onGameHide() {
        this.stopGame();
    }

    onGameShow() {
        this.startGame();
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

    bet(betData) {
        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
        }
        else {
            this.waitingProcessing = true;
            this.sendData(betData);
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

    sendData(payload: any) {
        cc.RedT.send({
            g: {
                [this.gameName]: payload
            }
        });
    }

    showProcessingWarning(show) {
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

    showUMWarning(data: any) {
        this.stopGame();
        this.umNotice && this.umNotice.show(data);
    }

    addNotice(text) {
        var notice = cc.instantiate(this.miniNoticePrefab);
        var noticeComponent = notice.getComponent("mini_warning");
        noticeComponent.text.string = text;
        this.noticeNode.addChild(notice);
    }

    showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.noticeNode, false, bet, 1);
    }

    /** Clear all intervals and timeouts in game */
    protected stopGame() {
    }

    /** Register with game on server */
    protected startGame() {
    }

    protected addHandlers(...handlers: DataHandler[]): void {
        this.dataHandlers.push(...handlers);
    }
}
