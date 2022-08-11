const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticNode extends cc.Component {
    @property
    groupId = 0;

    originalParent: cc.Node;
    originalPosition: cc.Vec3;

    init() {
        this.originalParent = this.node.parent;
        this.originalPosition = this.node.position;
        this.schedule(this.checkOriginalParentExists, 0.5, cc.macro.REPEAT_FOREVER);
        this.originalParent.on(cc.Node.EventType.POSITION_CHANGED, this.updatePosition, this);
    }

    updatePosition() {
        this.node.position = this.node.parent.convertToNodeSpaceAR(this.originalParent.convertToWorldSpaceAR(this.originalPosition));
    }

    checkOriginalParentExists() {
        if (!this.originalParent || !this.originalParent.isValid) {
            this.unschedule(this.checkOriginalParentExists);
            this.node.destroy();
        }
    }
}
