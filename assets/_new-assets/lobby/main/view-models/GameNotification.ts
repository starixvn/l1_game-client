
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameNotification extends cc.Component {
    @property
    gameId = 1;

    @property
    key = "lobby"

    @property(cc.Node)
    noticeNode: cc.Node = null;

    dataKey = "";
    onLoad() {
        this.dataKey = `${this.key}_${this.gameId}`;
        cc.RedT.addDataObserver(this.dataKey, this.receivedData.bind(this))
    }

    onDestroy() {
        cc.RedT.removeDataObserver(this.dataKey);
    }

    receivedData(data) {
        if (data.gameNotifications) {
            const notification = data.gameNotifications.find(notification => notification.gameId === this.gameId);
            if (notification) {
                this.noticeNode.active = true;
            }
        }
    }
}
