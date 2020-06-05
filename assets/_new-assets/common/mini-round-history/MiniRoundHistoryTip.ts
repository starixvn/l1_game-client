const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class MiniRoundHistoryTip extends cc.Component {
    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    public abstract setData(data: any);

    public show(show: boolean = true) {
        this.node.active = show;
    }
}
