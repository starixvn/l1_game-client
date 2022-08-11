import GameUtils from "../GameUtils";
import StaticNode from "./StaticNode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StaticGroup extends cc.Component {
    @property({ type: cc.Node })
    contents: cc.Node[] = [];

    @property(cc.Node)
    container: cc.Node = null;

    @property
    groupId = 0;

    @property
    usingLayout = false;

    private initialized = false;

    lateUpdate() {
        this.initForContents();
    }

    initForContents() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.contents.forEach((child) => {
            child.on(cc.Node.EventType.CHILD_ADDED, () => this.moveNodeToContainer(child, this.container));
            this.moveNodeToContainer(child, this.container);
        });
    }

    moveNodeToContainer(content: cc.Node, container: cc.Node) {
        const staticNodes = content.getComponentsInChildren(StaticNode).filter((node) => node.groupId === this.groupId);
        staticNodes.forEach((staticNode) => {
            staticNode.init();
            GameUtils.moveToOtherNode(staticNode.node, container);
        });
    }
}
