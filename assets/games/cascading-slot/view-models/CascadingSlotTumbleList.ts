import CascadingSlotTumbleItem from "./CascadingSlotTumbleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTumbleList extends cc.Component {
    @property(cc.Prefab)
    tumbleItem: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    scrollView: cc.ScrollView = null;
    onLoad() {
        this.scrollView = this.getComponent(cc.ScrollView);
    }

    addIcons(icons: any) {
        Object.entries(icons).forEach(([key, value]) => {
            const tumbleNode = cc.instantiate(this.tumbleItem);
            const control = tumbleNode.getComponent(CascadingSlotTumbleItem);
            const { count, win } = value as any;
            control.setData(+key, count, win);
            this.content.addChild(tumbleNode);
        });

        if (this.scrollView && this.content.childrenCount > 0) {
            const itemHeight = this.content.children[0].height;
            const contentHeight = this.content.childrenCount * itemHeight;
            this.scrollView.enabled = contentHeight > this.scrollView.node.height;
        }
    }

    clear() {
        this.content.destroyAllChildren();
        this.scrollView && !this.scrollView.enabled;
    }
}
