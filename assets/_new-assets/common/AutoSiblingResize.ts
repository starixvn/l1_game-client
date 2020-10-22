
const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class AutoSiblingResize extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;

    onLoad() {
        this.target.on(cc.Node.EventType.SIZE_CHANGED, this.resizeNode, this);
    }

    onDestroy() {
        this.target.off(cc.Node.EventType.SIZE_CHANGED, this.resizeNode, this);
    }

    resizeNode() {
        this.node.width = this.target.width;
        this.node.height = this.target.height;

        this.node.children.forEach(child => {
            const widget = child.getComponent(cc.Widget);
            if (widget) {
                widget.updateAlignment();
            }
        })
    }
}
