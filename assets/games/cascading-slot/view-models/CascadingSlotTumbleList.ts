import CascadingSlotTumbleItem from "./CascadingSlotTumbleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTumbleList extends cc.Component {
    @property(cc.Prefab)
    tumbleItem: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    trialModeNode: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    private HEIGHT_PER_ROW = 35;
    private NUMBER_MAX_ITEM = 7;

    onLoad() {
        this.scrollView = this.scrollView.getComponent(cc.ScrollView);
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
        const numberChild = this.content.childrenCount;
        const contentHeight = numberChild * itemHeight;
        this.content.height = contentHeight;
        if (this.scrollView && numberChild > 0) {
            this.scrollView.enabled = contentHeight > this.scrollView.node.height;
            if (this.scrollView.enabled) {
                this.scrollView.scrollToTop(0);
            }
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
        this.scrollView.enabled = false;
        this.content.position = cc.v3(0, 0);
    }

    setAnimation(node: cc.Node, index: number) {
        if (index < this.NUMBER_MAX_ITEM) {
            node.position = cc.v3(0, 227.5, 0);
        } else {
            const y = this.HEIGHT_PER_ROW / 2 + (index + this.NUMBER_MAX_ITEM - 1) * this.HEIGHT_PER_ROW;
            node.position = cc.v3(0, y, 0);
        }

        const y = this.HEIGHT_PER_ROW / 2 + (index - 1) * this.HEIGHT_PER_ROW;
        cc.tween(node)
            .to(0.2, { position: cc.v3(0, y, 0) }, { easing: "sineOut" })
            .to(0.1, { position: cc.v3(0, y + 2, 0) }, { easing: "sineOut" })
            .to(0.1, { position: cc.v3(0, y, 0) }, { easing: "sineOut" })
            .start();
    }

    offerTrialMode(isTrialMode: boolean) {
        let itemHeight = this.HEIGHT_PER_ROW;
        this.trialModeNode.active = isTrialMode;
        const listContainer = this.node.getChildByName("scroll-node");

        if (this.content.children.length > 0) {
            itemHeight = this.content.children[0].height;
        }

        this.content.height = this.content.childrenCount * itemHeight;

        if (isTrialMode) {
            listContainer.height = 180;
        } else {
            listContainer.height = 250;
        }
    }
}
