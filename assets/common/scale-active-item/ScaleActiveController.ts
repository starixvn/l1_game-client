import SabaConfigs = require("../../configs/SabaConfigs");
import ActiveItem from "./ActiveItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScaleActiveController extends cc.Component {
    activeScale = 1;
    miniScale = 0.6;
    items: ActiveItem[] = [];

    onLoad() {
        this.activeScale = !cc.sys.isMobile ? SabaConfigs.desktopMiniGameScale : 1;
    }

    addItem(node: cc.Node) {
        const item = node.getComponent(ActiveItem);
        if (item) {
            item.onActive = () => {};
            this.items.push(item);
        }
    }

    onActive(activeItem: ActiveItem) {
        this.items.forEach((item) => {
            const scale = item === activeItem ? this.activeScale : this.miniScale;
            this.scaleItem(item.node, scale);
        });
    }

    scaleItem(item: cc.Node, scale: number) {
        const duration = 0.3;
        cc.tween(item).to(duration, { scale: scale }, { easing: "sineInOut" }).start();
    }
}
