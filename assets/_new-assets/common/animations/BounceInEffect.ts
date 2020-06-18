const { ccclass, property } = cc._decorator;

@ccclass
export default class BounceInEffect extends cc.Component {
    @property
    time: number = 0.5;

    onEnable() {
        this.node.opacity = 0;
        this.node.scale = 0;
        this.node.runAction(cc.spawn(
            cc.scaleTo(this.time, 1).easing(cc.easeBackOut()),
            cc.fadeTo(this.time / 2, 255)));
    }

    onDisable() {
        // this.node.stopAllActions();
        console.log("disable")

        this.node.runAction(cc.spawn(
            cc.scaleTo(this.time, 0).easing(cc.easeBackOut()),
            cc.fadeTo(this.time / 2, 0)));
    }
}
