const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelGuide extends cc.Component {

    onDisable() {
        this.node.destroy();
    }
}
