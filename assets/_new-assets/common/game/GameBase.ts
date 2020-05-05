import DataHandler from "../_base/view-models/DataHandler";
import UmWarning from "../um-warning/UmWarning";
import { GameBaseConfigs } from "./GameBaseConfig";
import GameBaseUmDataHandler from "./handlers/GameBaseUmHandler";
import GameBaseNoticeHandler from "./handlers/GameBaseNoticeHandler";
import GameBaseStatusHandler from "./handlers/GameBaseStatusHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBase extends cc.Component {
    @property(cc.Prefab)
    processWarningPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    miniNoticePrefab: cc.Prefab = null;

    @property(cc.Node)
    notice: cc.Node = null;

    @property(UmWarning)
    umNotice: UmWarning = null;

    private dataHandlers: DataHandler[] = [];

    private processingWarning: cc.Node;
    public waitingProcessing = false;
    public disabledGame = false;
    public currentTimeRemaining: number;
    public config: GameBaseConfigs;


    protected onLoad() {
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    protected onDestroy() {
        cc.game.off(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    protected onGameHide() {
        this.stopGame();
    }

    protected onGameShow() {
        this.regEvent(true);
    }

    /** Clear all intervals and timeouts in game */
    protected stopGame() {

    }

    /** Register with game on server */
    protected regEvent(reg: boolean) {

    }

    protected initHandlers() {
        var handlers = [
            new GameBaseUmDataHandler(this),
            new GameBaseNoticeHandler(this),
            new GameBaseStatusHandler(this),
        ];
        this.dataHandlers.push(...handlers);
    }

    protected onData(data: any) {
        for (let index = 0; index < this.dataHandlers.length; index++) {
            let handler = this.dataHandlers[index];
            if (index == 0 && handler.handle(data)) { //um handler
                break;
            } else {
                handler.handle(data);
            }
        }
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
}
