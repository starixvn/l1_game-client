const { ccclass, property } = cc._decorator;
import ChanLeMain from './main/ChanLeMain';
import MiniPanel from '../../../mini-games-panel/view-models/MiniPanel';
import ChanLeConfigs from './ChanLeConfigs';

@ccclass
export default class ChanLe extends cc.Component {
    @property(ChanLeMain)
    public main: ChanLeMain = null;

    @property(cc.Prefab)
    public topUsers: cc.Prefab = null;

    @property(cc.Prefab)
    public history: cc.Prefab = null;

    @property(cc.Prefab)
    public turnHistory: cc.Prefab = null;

    @property(cc.Prefab)
    public stats: cc.Prefab = null;

    @property(cc.Prefab)
    public guide: cc.Prefab = null;

    public gameType: string = "5";
    public gameName: string = "chanle";
    public gameConfigs: ChanLeConfigs;

    private miniPanel: MiniPanel;
    private touchOffset: cc.Vec2 = null;
    private isGameHide = false;
    board: any;

    init(miniPanel: MiniPanel, gameType: string) {
        this.miniPanel = miniPanel;
        this.gameType = gameType;
        this.main.init(this);
        this.initConfigs();
    }

    initConfigs() {
        this.gameConfigs = new ChanLeConfigs();
    }

    onEnable() {
        this.onGameShow();
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
        this.main.background.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.main.background.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
    }

    onDisable() {
        this.onGameHide();
        cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
        cc.game.off(cc.game.EVENT_HIDE, this.onGameHide, this);
        this.main.background.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.main.background.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.node.destroyAllChildren();
        this.node.destroy();
    }

    onData(data: any) {
        !this.isGameHide && this.main.onData(data);
    }

    openGame() {
        cc.RedT.audio.playClick();
        this.node.active = true;
    }

    closeGame() {
        cc.RedT.audio.playUnClick();
        this.node.active = false;
    }

    showTop() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.topUsers);
        this.miniPanel.dialog.insertChild(dialog, 0);
        var topUsers = dialog.getComponent("ChanLeTopUsers");
        topUsers.init(this);
    }
    showStats() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.stats);
        this.miniPanel.dialog.insertChild(dialog, 0);
        var stats = dialog.getComponent("ChanLeStats");
        stats.init(this);
    }
    showHistory() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.history);
        this.miniPanel.dialog.insertChild(dialog, 0);
        var history = dialog.getComponent("ChanLeHistory");
        history.init(this);
    }
    showTurnHistory(event) {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.turnHistory);
        this.miniPanel.dialog.insertChild(dialog, 0);
        var history = dialog.getComponent("ChanLeTurnHistory");
        history.init(this);
        history.getPhien(event.target.phien);
    }
    showGuide() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.guide);
        this.miniPanel.dialog.insertChild(dialog, 0);
        var guide = dialog.getComponent("dialogHuongDan");
        guide.select("TaiXiu");
    }

    sendData(payload: any) {
        cc.RedT.send({
            g: {
                chanle: payload
            }
        });
    }

    private eventStart(event) {
        this.touchOffset = cc.v2(
            event.touch.getLocationX() - this.node.position.x,
            event.touch.getLocationY() - this.node.position.y
        );

        this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
    }

    private eventMove(event) {
        this.node.position = cc.v2(
            event.touch.getLocationX() - this.touchOffset.x,
            event.touch.getLocationY() - this.touchOffset.y
        );
    }

    private onGameShow() {
        this.isGameHide = false;
        this.sendData({ view: true, get_time: true, getLogs: true });
    }

    private onGameHide() {
        this.isGameHide = true;
        this.main.onGameHide();
        this.sendData({ view: false });
    }
}
