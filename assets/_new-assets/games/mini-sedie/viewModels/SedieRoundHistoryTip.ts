const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieRoundHistoryTip extends cc.Component {
    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Label)
    red: cc.Label = null;

    @property(cc.Label)
    white: cc.Label = null;

    public setData(red: number) {
        this.result.string = red % 2 === 0 ? "CHẴN" : "LẺ";
        this.red.string = red.toString();
        this.white.string = (4 - red).toString();
        this.show();
    }

    public show(show: boolean = true) {
        this.node.active = show;
    }
}
