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

    onLoad() {
        this.contents.forEach((child) => {
            child.on(cc.Node.EventType.CHILD_ADDED, () => this.moveNodeToContainer(child, this.container));
            this.moveNodeToContainer(child, this.container);
        });
    }

    moveNodeToContainer(content: cc.Node, container: cc.Node) {
        const children = content
            .getComponentsInChildren(StaticNode)
            .filter((node) => node.groupId === this.groupId)
            .map((comp) => comp.node);
        children.forEach((child) => {
            GameUtils.moveToOtherNode(child, container);
        });
    }
}
