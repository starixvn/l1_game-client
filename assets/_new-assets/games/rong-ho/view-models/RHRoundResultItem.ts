const { ccclass, property } = cc._decorator;

@ccclass
export default class RHRoundResultItem extends cc.Component {
    @property(cc.Label)
    draw: cc.Label = null;

    public setValue(value: number) {
        this.draw.node.active = value > 0;
        this.draw.string = value.toString();
    }
}
