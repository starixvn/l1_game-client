const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoNumber extends cc.Component {

    @property(cc.Label)
    numberLabel: cc.Label = null;

    setNumber(value: number) {
        this.numberLabel.string = value.toString();
        this.show(true);
    }

    show(show: boolean) {
        this.node.active = show;
    }
}
