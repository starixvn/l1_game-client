const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieRoundHistoryTip extends cc.Component {

    @property(cc.Label)
    red: cc.Label = null;

    @property(cc.Label)
    white: cc.Label = null;

    public setData(red: number) {
        this.red.string = red.toString();
        this.white.string = (4 - red).toString();
        this.show();
    }

    public show(show: boolean = true) {
        this.node.active = show;
    }
}
