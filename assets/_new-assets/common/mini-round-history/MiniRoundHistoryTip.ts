const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class MiniRoundHistoryTip extends cc.Component {

    public abstract setData(data: any);

    public show(show: boolean = true) {
        this.node.active = show;
    }
}
