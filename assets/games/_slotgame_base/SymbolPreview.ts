import GameUIManager from "../../lobby/main/view-models/GameUIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SymbolPreview extends cc.Component {
    @property(sp.Skeleton)
    icon: sp.Skeleton = null;

    @property(cc.Node)
    infoNode: cc.Node = null;

    @property(cc.Node)
    border: cc.Node = null;

    gameUIManager = GameUIManager.getInstance();
    callbacks = {};
    events = [
        GameUIManager.Events.CLICK_AUTO_SPIN_BUTTON,
        GameUIManager.Events.CLICK_LINE_SELECTION_BUTTON,
        GameUIManager.Events.CLICK_SPIN_BUTTON,
        GameUIManager.Events.CLICK_HAMBURGER_MENU,
        GameUIManager.Events.CLICK_OUTSIDE_REEL_AREA
    ];

    onLoad() {
        this.events.forEach((event) => {
            this.callbacks[event] = this.gameUIManager.emitterListener(event, () => {
                this.hidePreview();
            });
        });
    }

    onDestroy() {
        Object.keys(this.callbacks).forEach((key) => {
            this.gameUIManager.emitter.removeListener(key, this.callbacks[key].callback);
        });
    }

    hidePreview() {
        this.node.parent.active = false;
        this.node.destroy();
    }

    setInfo(info: { spine: sp.SkeletonData; odds: any; colorList: [string, string]; borderColor: string }) {
        this.icon.skeletonData = info.spine;
        this.icon.setAnimation(0, "highlight", false);
        this.border.color = cc.Color.WHITE.fromHEX(info.borderColor);
        const keys = Object.keys(info.odds);
        this.infoNode.children.forEach((node, index) => {
            const key = keys[index];
            const show = index < keys.length && info.odds[key] > 0;
            node.active = show;

            if (!show) {
                return;
            }
            const values = [key, info.odds[key]];
            node.children.forEach((child, childIndex) => {
                child.getComponent(cc.Label).string = values[childIndex];
                child.color = cc.Color.WHITE.fromHEX(info.colorList[childIndex]);
            });
        });
    }
}
