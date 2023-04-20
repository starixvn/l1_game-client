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
}
