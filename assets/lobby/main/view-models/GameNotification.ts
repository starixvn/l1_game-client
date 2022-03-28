import NotificationService from "../../../common/auth/NotificationService";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameNotification extends cc.Component {
    @property
    gameId = 1;

    @property
    key = "lobby";

    @property(cc.Node)
    noticeNode: cc.Node = null;

    private keyType = "";
    private dataKey = "gameNotification";
    private isScheduling = false;
    notificationService: NotificationService;

    onLoad() {
        this.keyType = `${this.key}_${this.gameId}_${Date.now()}`;
        this.notificationService = NotificationService.getInstance();
        this.notificationService.addDataObserver(this.dataKey, this.keyType, this.receivedData.bind(this));
        this.getData();
        this.schedule(this.getData, 1, cc.macro.REPEAT_FOREVER, 0);
        this.isScheduling = true;
    }

    private getData() {
        this.notificationService.emitEvent("gameNotification", {
            gameId: this.gameId
        });
    }

    onDestroy() {
        this.notificationService.removeDataObserver(this.dataKey, this.keyType);
    }

    private receivedData(data) {
        this.removeSchedule();
        const notification = data.find((notification) => notification.gameId === this.gameId);
        if (notification) {
            this.noticeNode.active = true;
        }
    }

    private removeSchedule() {
        if (this.isScheduling) {
            this.getData();
            this.unschedule(this.getData);
            this.isScheduling = false;
        }
    }
}
