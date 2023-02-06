import GameUtils from "../../common/GameUtils";
import SlotBoard from "./SlotBoard";
import StandardSlotReelItem from "./StandardSlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotBoard extends SlotBoard {
    @property(cc.Node)
    previewOverlay: cc.Node = null;

    private currentPreviewItem: cc.Node = null;
    onSymbolPreview = (symbol: number, worldPosition: cc.Vec3, isInfoOnLeft: boolean) => {};

    initReels() {
        super.initReels();
        this.reels.forEach((reel, index) => {
            const isInfoOnLeft = index === this.reels.length - 1;
            reel.items.forEach((item) => {
                item.node.on(cc.Node.EventType.TOUCH_END, () => {
                    if (this.currentPreviewItem === item.node) {
                        this.hideSymbolPreview();
                        return;
                    }
                    this.currentPreviewItem = item.node;
                    const worldPosition = item.node.convertToWorldSpaceAR(cc.v3());
                    this.onSymbolTouched(item.index, worldPosition, isInfoOnLeft);
                });
            });
        });
    }

    setItemWinningEffect(prefab: cc.Prefab) {
        this.reels.forEach((reel) => {
            reel.items.forEach((item: StandardSlotReelItem) => {
                item.addWinningEffect(prefab);
            });
        });
    }

    showPreview(previewNode: cc.Node, worldPosition: cc.Vec3) {
        this.previewOverlay.active = true;
        this.hideOtherPreview();
        this.previewOverlay.addChild(previewNode);
        previewNode.position = this.previewOverlay.convertToNodeSpaceAR(worldPosition);
        GameUtils.showNode(previewNode);
    }

    hideOtherPreview() {
        this.previewOverlay.children.forEach((node) =>
            GameUtils.hideNode2(node, {
                onHidden: () => {
                    node.destroy();
                    this.previewOverlay.active = this.previewOverlay.childrenCount > 0;
                }
            })
        );
    }

    private onSymbolTouched(symbol: number, worldPosition: cc.Vec3, isInfoOnLeft: boolean) {
        this.onSymbolPreview(symbol, worldPosition, isInfoOnLeft);
    }

    private hideSymbolPreview() {
        this.previewOverlay.active = false;
        this.previewOverlay.destroyAllChildren();
        this.currentPreviewItem = null;
    }

    spin(duration: number, turbo: boolean): Promise<void> {
        this.hideSymbolPreview();
        return super.spin(duration, turbo);
    }
}
