const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoNumber extends cc.Component {

    @property(cc.Label)
    numberLabel: cc.Label = null;

    protected animated = false;

    setNumber(value: number, animated: boolean) {
        this.animated = animated;
        this.numberLabel.string = value.toString();
        this.show(true);
    }

    show(show: boolean) {
        this.node.active = show;
    }

    onEnable() {
        if (this.animated) {
            this.node.scale = 1.5;
            this.node.runAction(cc.scaleTo(.3, 1).easing(cc.easeBounceOut()));
        }
    }

    onDisable() {
        this.node.stopAllActions();
    }
}
