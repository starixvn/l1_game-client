const { ccclass, property } = cc._decorator;
import ChanLeMain from './main/ChanLeMain';
import MiniPanel from '../../../mini-games-panel/view-models/MiniPanel';

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

    private miniPanel: MiniPanel;
    protected gameType: string = "5";
    protected gameName: string = "chanle";
    board: any;

    init(miniPanel: MiniPanel, gameType: string) {
        this.miniPanel = miniPanel;
        this.gameType = gameType;

        this.main.init(this);
    }


    onload() {
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, self);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, self);
    }

    onEnable() {
        this.onGameShow();
    }

    onDisable() {
        this.onGameHide();
        this.node.destroyAllChildren();
        this.node.destroy();
    }

    onDestroy() {
        cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
        cc.game.off(cc.game.EVENT_HIDE, this.onGameHide, this);
    }

    onData(data: any) {
        this.main.onData(data);
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
        guide.select("ChanLe");
    }

    sendData(payload: any) {
        cc.RedT.send({
            g: {
                chanle: payload
            }
        });
    }

    private onGameShow() {
        this.sendData({ view: true, get_time: true, getLogs: true });
    }

    private onGameHide() {
        this.main.onGameHide();
        this.sendData({ view: false });
    }
}
