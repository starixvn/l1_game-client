const { ccclass, property } = cc._decorator;

@ccclass
export default class SocketIOHistoryItemBase extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    start() {
        this.node.getComponentsInChildren(cc.Label).forEach((label) => {
            label.fontSize = 18;
        });
    }
}
