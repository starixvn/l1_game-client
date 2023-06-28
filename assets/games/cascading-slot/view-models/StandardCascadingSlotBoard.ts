import PreviewOddsPopup from "../../_slotgame_base/PreviewOddsPopup";
import CascadeSlotBoard from "./CascadeSlotBoard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardCascadingSlotBoard extends CascadeSlotBoard {
    @property(PreviewOddsPopup)
    previewPopup: PreviewOddsPopup = null;

    public createReels() {
        super.createReels();
        this.previewPopup.addPreviewPopup(this.reels);
    }

    showPreview(previewNode: cc.Node, worldPosition: cc.Vec3) {
        this.previewPopup.showPreview(previewNode, worldPosition);
    }

    public addItems(data: number[][]) {
        this.reels.forEach((reel, index) => {
            const items = data[index];
            const reelItems = reel.addItems(items);
            const isInfoOnLeft = index === this.reels.length - 1 || index === this.reels.length - 2;
            reelItems.forEach((item) => {
                this.previewPopup.addReelItemEvent(item, isInfoOnLeft);
            });
        });
    }
}
