import GameBase from "./GameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMiniBase extends GameBase {
    @property(cc.Node)
    background: cc.Node = null;

    private touchOffset = cc.v2(0, 0);

    onEnable() {
        super.onEnable();
        this.background.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        cc.RedT.addDataObserver(this.gameName, this.receivedData.bind(this));
    }

    receivedData(data) {
        if (data[this.gameName]) {
            this.onData(data[this.gameName]);
        }
    }

    onDisable() {
        super.onDisable();

        this.background.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.background.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        cc.RedT.removeDataObserver(this.gameName);
    }

    eventStart(e) {
        this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
        this.touchOffset = cc.v2(
            e.touch.getLocationX() - this.node.position.x,
            e.touch.getLocationY() - this.node.position.y
        );
    }

    eventMove(e) {
        this.node.position = cc.v2(
            e.touch.getLocationX() - this.touchOffset.x,
            e.touch.getLocationY() - this.touchOffset.y
        );
    }

    onSignIn() {
        if (!this.node.active) {
            return;
        }

        this.registerViewGame();
    }
}