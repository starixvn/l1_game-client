const { ccclass, property } = cc._decorator;

@ccclass
export default class GameNotification extends cc.Component {
    @property
    gameId = 1;

    @property
    key = "lobby";

    @property(cc.Node)
    noticeNode: cc.Node = null;

    private dataKey = "";
    private isScheduling = false;

    onLoad() {
        this.dataKey = `${this.key}_${this.gameId}`;
        cc.RedT.addDataObserver(this.dataKey, this.receivedData.bind(this));
        this.getData();
        this.schedule(this.getData, 1, cc.macro.REPEAT_FOREVER, 0);
        this.isScheduling = true;
    }

    private getData() {
        cc.RedT.send({
            gameNotifications: {
                gameId: this.gameId
            }
        });
    }

    onDestroy() {
        cc.RedT.removeDataObserver(this.dataKey);
    }

    private receivedData(data) {
        if (data.gameNotifications) {
            this.removeSchedule();
            const notification = data.gameNotifications.find((notification) => notification.gameId === this.gameId);
            if (notification) {
                this.noticeNode.active = true;
            }
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
