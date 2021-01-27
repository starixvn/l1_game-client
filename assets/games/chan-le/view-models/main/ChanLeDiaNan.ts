import ChanLeMain from "./ChanLeMain";
const { ccclass, property } = cc._decorator;

@ccclass
export default class ChanLeDiaNan extends cc.Component {
    private main: ChanLeMain;
    private touchOffset: cc.Vec2;

    init(main: ChanLeMain) {
        this.main = main;
    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
    }
    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
    }

    show() {
        this.main.isNan = !this.main.isNan;
        this.main.diaNanSprite.spriteFrame = this.main.isNan
            ? this.main.diaNanSpriteFrames[0]
            : this.main.diaNanSpriteFrames[1];
    }

    eventStart(e) {
        this.touchOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
    }
    eventMove(e) {
        this.node.position = cc.v2(e.touch.getLocationX() - this.touchOffset.x, e.touch.getLocationY() - this.touchOffset.y);
    }
}
