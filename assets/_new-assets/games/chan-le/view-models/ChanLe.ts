const { ccclass, property } = cc._decorator;
import ChanLeMain from './main/ChanLeMain';
import ChanLeTopUsers from './top-users/ChanLeTopUsers';
import ChanLeHistory from './history/ChanLeHistory';
import ChanLeTurnHistory from './turn-history/ChanLeTurnHistory';
import MiniPanel from '../../../mini-games-panel/view-models/MiniPanel';
import { GameConfigs } from './ChanLeConfigs';
import ChanLeLogTips from './main/ChanLeLogTips';
import ChanLeStats from './statistics/ChanLeStats';

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

    public gameName: string;
    public gameConfigs: GameConfigs;
    public gameTitle: string;
    public statistics: ChanLeStats;
    private miniPanel: MiniPanel;
    private topUsers: ChanLeTopUsers;
    private history: ChanLeHistory;
    private turnHistory: ChanLeTurnHistory;
    private touchOffset: cc.Vec2 = null;
    private isGameHide = false;

    init(miniPanel: MiniPanel, gameName: string, config: GameConfigs, gameTitle: string, hideDiaNan = false) {
        this.miniPanel = miniPanel;
        this.gameName = gameName;
        this.gameTitle = gameTitle;
        this.main.init(this);
        this.gameConfigs = config;
        this.main.diaNanSprite.node.active = !hideDiaNan;
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
        this.handleDataTurnHistory(data);
    }

    showTop() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.topUsersPrefab);
        this.topUsers = dialog.getComponent("ChanLeTopUsers");
        this.topUsers.init(this);
        this.miniPanel.dialog.addChild(dialog);
    }
    hideTop() {
        this.topUsers = null;
    }

    showStats() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.statsPrefab);
        this.statistics = dialog.getComponent("ChanLeStats");
        this.statistics.init(this);
        this.miniPanel.dialog.addChild(dialog);
    }

    hideStats() {
        this.statistics = null;
    }

    showHistory() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.historyPrefab);
        this.history = dialog.getComponent("ChanLeHistory");
        this.history.init(this);
        this.miniPanel.dialog.addChild(dialog);
    }

    hideHistory() {
        this.history = null;
    }

    showTurnHistory(event) {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.turnHistoryPrefab);
        this.turnHistory = dialog.getComponent("ChanLeTurnHistory");
        var dotLog = event.target.getComponent("ChanLeLogTips") as ChanLeLogTips;
        console.log(dotLog);

        this.turnHistory.init(this, dotLog.turnId);
        this.miniPanel.dialog.insertChild(dialog, 0);
    }

    hideTurnHistory() {
        this.turnHistory = null;
    }

    showGuide() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.guidePrefab);
        var guide = dialog.getComponent("GameGuide");
        guide.select("ChanLe");
        this.miniPanel.dialog.addChild(dialog);
    }

    sendData(payload: any) {
        cc.RedT.send({
            g: {
                [this.gameName]: payload
            }
        });
    }

    private handleDataTopUsers(data: any) {
        if (data.get_top) {
            this.topUsers.onData(data.get_top);
        }
    }

    private handleDataHistory(data: any) {
        if (data.get_log) {
            this.history.onData(data.get_log);
        }
    }

    private handleDataTurnHistory(data: any) {
        if (data.get_phien) {
            this.turnHistory.onData(data.get_phien);
        }
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
