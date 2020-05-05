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
    notice: cc.Node = null;

    @property(UmWarning)
    umNotice: UmWarning = null;

    @property(cc.Node)
    timeWaitNode: cc.Node = null;

    @property(cc.Label)
    timeWaitLabel: cc.Label = null;

    @property({ type: AnimatedTime })
    animatedTime: AnimatedTime = null;

    private dataHandlers: DataHandler[] = [];

    private processingWarning: cc.Node;
    public waitingProcessing = false;
    public disabledGame = false;
    public currentTimeRemaining: number;
    public config: GameBaseConfigs;


    onLoad() {
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    onDestroy() {
        cc.game.off(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
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

    /** Clear all intervals and timeouts in game */
    protected stopGame() {
    }

    /** Register with game on server */
    protected startGame() {
    }

    protected initHandlers() {
        var handlers = [
            new GameBaseUmDataHandler(this),
            new GameBaseNoticeHandler(this),
            new GameBaseStatusHandler(this),
            new GameBaseBetHandler(this),
        ];
        this.dataHandlers.push(...handlers);
    }

    /** Handle status data */
    public status(win, bet) {

    }

    public showProcessingWarning(show) {
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

    public showUMWarning(data: any) {
        this.stopGame();
        this.umNotice.show(data);
    }

    public addNotice(text) {
        var notice = cc.instantiate(this.miniNoticePrefab);
        var noticeComponent = notice.getComponent("mini_warning");
        noticeComponent.text.string = text;
        this.notice.addChild(notice);
    }

    public showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.notice, false, bet, 1);
    }
}
