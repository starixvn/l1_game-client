import NotificationService from "../../common/auth/NotificationService";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniGameCounter extends cc.Component {
    @property(cc.Sprite)
    result: cc.Sprite = null;

    @property(cc.Label)
    timeCountDown: cc.Label = null;

    @property
    gameId = 0;

    onLoad() {
        this.result.node.active = false;
        this.timeCountDown.node.active = false;
        this.requestData();
        NotificationService.getInstance().addDataObserver("mini-counter", "mini-counter", this.onReceivedData.bind(this));
    }

    private requestData() {
        NotificationService.getInstance().emitEvent("getMiniCounter", {});
    }

    onReceivedData() {}
}
