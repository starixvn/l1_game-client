const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterCurrentCandleValue extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Label)
    value: cc.Label = null;

    onLoad() {
        this.background.active = false;
    }

    setData(openValue: number, closeValue: number) {
        this.background.active = true;
        const color = cc.Color.WHITE;
        let differenceValue = closeValue - openValue;
        this.background.color = differenceValue > 0 ? color.fromHEX("#10c476") : color.fromHEX("#f53d53");
        this.value.string = closeValue.toString();
    }
}
