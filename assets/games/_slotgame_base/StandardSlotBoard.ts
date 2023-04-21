import PreviewOddsPopup from "./PreviewOddsPopup";
import SlotBoard from "./SlotBoard";
import StandardSlotReelItem from "./StandardSlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotBoard extends SlotBoard {
    @property(PreviewOddsPopup)
    previewPopup: PreviewOddsPopup = null;

    initReels() {
        super.initReels();
        this.previewPopup.addPreviewPopup(this.reels);
    }

    setItemWinningEffect() {
        this.reels.forEach((reel) => {
            reel.items.forEach((item: StandardSlotReelItem) => {
                item.addWinningEffect();
            });
        });
    }

    updateSymbolDuration(duration: number) {
        this.reels.forEach((reel) => {
            reel.items.forEach((item: StandardSlotReelItem) => {
                item.updateDuration(duration);
            });
        });
    }

    showPreview(previewNode: cc.Node, worldPosition: cc.Vec3) {
        this.previewPopup.showPreview(previewNode, worldPosition);
    }

    spin(duration: number, turbo: boolean): Promise<void> {
        this.previewPopup.hideSymbolPreview();
        return super.spin(duration, turbo);
    }
}
