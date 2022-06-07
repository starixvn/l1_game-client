import CascadingSlotTumbleItem from "./CascadingSlotTumbleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTumbleList extends cc.Component {
    @property(cc.Prefab)
    tumbleItem: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    animArea: cc.Node = null;

    @property(cc.Node)
    tempNode: cc.Node = null;

    scrollView: cc.ScrollView = null;
    onLoad() {
        this.scrollView = this.getComponent(cc.ScrollView);
    }

    addIcons(icons: any, countPerRound: number): number {
        this.content.active = true;
        Object.entries(icons).forEach(([key, value]) => {
            countPerRound++;
            const tumbleNode = cc.instantiate(this.tumbleItem);
            const control = tumbleNode.getComponent(CascadingSlotTumbleItem);
            const { count, win } = value as any;
            control.setData(+key, count, win);
            this.setAnimation(tumbleNode, countPerRound);
            this.content.addChild(tumbleNode);
        });
        const itemHeight = this.content.children[0].height;
        const contentHeight = this.content.childrenCount * itemHeight;
        this.content.height = contentHeight;
        if (this.scrollView && this.content.childrenCount > 0) {
            this.scrollView.enabled = contentHeight > this.scrollView.node.height;
        }
        return countPerRound;
    }

    fall(node: cc.Node) {
        return new Promise<void>((resolve) => {
            cc.tween(node)
                .to(0.05, { position: cc.v3(0, 17.5, 0) }, { easing: "sineOut" })
                .to(0.05, { opacity: 0 }, { easing: "sineOut" })
                .call(() => {
                    resolve();
                })
                .start();
        });
    }

    async clear() {
        for (let i = 0; i < this.content.childrenCount; i++) {
            await this.fall(this.content.children[i]);
        }
        this.content.destroyAllChildren();
        this.scrollView && !this.scrollView.enabled;
        this.content.position.y = -125;
        this.content.anchorY = 0;
        this.content.active = false;
    }

    setAnimation(node: cc.Node, index: number) {
        if (index < 7) {
            node.position = cc.v3(0, 227.5, 0);
        } else {
            const y = 17.5 + (index + 6 - 1) * 35;
            node.position = cc.v3(0, y, 0);
        }

        const y = 17.5 + (index - 1) * 35;
        cc.tween(node)
            .to(0.2, { position: cc.v3(0, y, 0) }, { easing: "sineOut" })
            .to(0.1, { position: cc.v3(0, y + 2, 0) }, { easing: "sineOut" })
            .to(0.1, { position: cc.v3(0, y, 0) }, { easing: "sineOut" })
            .start();
    }
}
