const { ccclass, property } = cc._decorator;

@ccclass
export default class BounceInEffect extends cc.Component {

    @property
    time: number = 1;

    onEnable() {
        this.node.opacity = 0;
        this.node.scale = 0;
        this.node.runAction(cc.spawn(
            cc.scaleTo(this.time, 1).easing(cc.easeBackOut()),
            cc.fadeTo(this.time / 2, 255)));
    }

    onDisable() {
        this.node.stopAllActions();
    }
}
