import DataHandler from "../_base/view-models/DataHandler";
import UmWarning from "../um-warning/UmWarning";
import { GameBaseConfigs } from "./GameBaseConfig";
import GameBaseUmDataHandler from "./handlers/GameBaseUmHandler";

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

    }

    protected onGameShow() {

    }

    protected initHandlers() {
        this.dataHandlers.push(new GameBaseUmDataHandler(this));
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
        this.onGameHide();
        this.umNotice.show(data);
    }

    public addNotice(text) {
        var notice = cc.instantiate(this.miniNoticePrefab);
        var noticeComponent = notice.getComponent("mini_warning");
        noticeComponent.text.string = text;
        this.notice.addChild(notice);
    }
}
