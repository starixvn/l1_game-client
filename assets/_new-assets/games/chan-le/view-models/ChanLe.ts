const { ccclass, property } = cc._decorator;
import ChanLeMain from './main/ChanLeMain';
import ChanLeTopUsers from './top-users/ChanLeTopUsers';
import ChanLeHistory from './history/ChanLeHistory';
import MiniPanel from '../../../mini-games-panel/view-models/MiniPanel';
import ChanLeConfigs from './ChanLeConfigs';

@ccclass
export default class ChanLe extends cc.Component {
    @property(ChanLeMain)
    public main: ChanLeMain = null;

    @property(cc.Prefab)
    public topUsersPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    public historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    public turnHistoryPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    public statsPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    public guidePrefab: cc.Prefab = null;

    public gameType: string = "5";
    public gameName: string = "chanle";
    public gameConfigs: ChanLeConfigs;
    private miniPanel: MiniPanel;
    private topUsers: ChanLeTopUsers;
    private history: ChanLeHistory;
    private touchOffset: cc.Vec2 = null;
    private isGameHide = false;

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

    openGame() {
        cc.RedT.audio.playClick();
        this.node.active = true;
    }

    closeGame() {
        cc.RedT.audio.playUnClick();
        this.node.active = false;
    }

    onData(data: any) {
        !this.isGameHide && this.main.onData(data);

        this.handleDataTopUsers(data);
        this.handleDataHistory(data);
    }

    handleDataTopUsers(data: any) {
        if (data.get_top) {
            this.topUsers.onData(data.get_top);
        }
    }

    handleDataHistory(data: any) {
        if (data.get_log) {
            this.history.onData(data.get_log);
        }
    }

    showTop() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.topUsersPrefab);
        this.topUsers = dialog.getComponent("ChanLeTopUsers");
        this.topUsers.init(this);
        this.miniPanel.dialog.addChild(dialog);
    }
    showStats() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.statsPrefab);
        this.miniPanel.dialog.insertChild(dialog, 0);
        var stats = dialog.getComponent("ChanLeStats");
        stats.init(this);
    }
    showHistory() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.historyPrefab);
        this.history = dialog.getComponent("ChanLeHistory");
        this.history.init(this);
        this.miniPanel.dialog.addChild(dialog);
    }

    showTurnHistory(event) {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.turnHistoryPrefab);
        this.miniPanel.dialog.insertChild(dialog, 0);
        var history = dialog.getComponent("ChanLeTurnHistory");
        history.init(this);
        history.getPhien(event.target.phien);
    }

    showGuide() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.guidePrefab);
        var guide = dialog.getComponent("dialogHuongDan");
        guide.select("TaiXiu");
        this.miniPanel.dialog.addChild(dialog);
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
