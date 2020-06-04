const { ccclass, property } = cc._decorator;

@ccclass
export default class BlinkNode extends cc.Component {

    @property
    interval: number = 0.2;

    // onEnable() {
    //     this.playAnimation();
    // }

    playAnimation() {
        var action = cc.sequence(cc.fadeOut(this.interval), cc.fadeIn(this.interval));
        var repeat = cc.repeatForever(action);
        this.node.runAction(repeat);
    }

    onDisable() {
        this.node.stopAllActions();
    }
}
