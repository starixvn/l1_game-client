const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticNode extends cc.Component {
    @property
    groupId = 0;

    originalParent: cc.Node;

    onLoad() {
        this.originalParent = this.node.parent;
        this.schedule(this.checkOriginalParentExists, 0.5, cc.macro.REPEAT_FOREVER);
    }

    checkOriginalParentExists() {
        if (!this.originalParent || !this.originalParent.isValid) {
            this.unschedule(this.checkOriginalParentExists);
        }
    }
}
