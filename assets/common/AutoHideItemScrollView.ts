const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoHideItemScrollView extends cc.Component {
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    onLoad() {
        this.schedule(this.checkBorder, 0.1, cc.macro.REPEAT_FOREVER);
    }

    checkBorder() {
        const items = this.scrollView.content.children;
        const box = this.scrollView.node.getBoundingBox();
        const pos = this.scrollView.node.convertToWorldSpaceAR(cc.v2(0, 0));
        const container = cc.rect(pos.x - box.width / 2, pos.y - box.height / 2, box.width, box.height);
        items.forEach((item) => {
            const itemBox = item.getBoundingBoxToWorld();
            const show = container.intersects(itemBox);
            item.children.forEach((child) => (child.active = show));
        });
    }
}
