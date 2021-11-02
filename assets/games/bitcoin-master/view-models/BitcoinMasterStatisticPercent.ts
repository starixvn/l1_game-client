const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterStatisticPercent extends cc.Component {
    @property(cc.Label)
    text: cc.Label = null;

    @property(cc.Label)
    value: cc.Label = null;

    setData(text: string, value: number) {
        this.text.string = text;
        this.value.string = value.toString();
    }

    setColor(color: cc.Color) {
        this.text.node.color = color;
    }
}
