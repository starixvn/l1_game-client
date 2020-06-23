const { ccclass, property } = cc._decorator;

@ccclass
export default class BounceInEffect extends cc.Component {
    @property
    time: number = 0.5;

    private originScale: number;

    onEnable() {
        this.originScale = this.node.scale;
        this.node.opacity = 0;
        this.node.scale = 0;
        this.node.runAction(cc.spawn(
            cc.scaleTo(this.time, this.originScale).easing(cc.easeBackOut()),
            cc.fadeTo(this.time / 2, 255)));
    }

    onDisable() {
        this.node.stopAllActions();
        this.node.scale = this.originScale;
    }
}
