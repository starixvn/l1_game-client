const { ccclass, property } = cc._decorator;

@ccclass
export default class RHResultEffect extends cc.Component {
    onEnable() {
        this.node.scale = 2;
        this.node.runAction(cc.scaleTo(.3, 1));
    }

    onDisable() {
        this.node.stopAllActions();
    }
}
