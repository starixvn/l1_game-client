import GameUtils from "../../../common/GameUtils";
import GameUIManager from "../../../lobby/main/view-models/GameUIManager";
import CascadeSlotReelItem from "./CascadeSlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardCascadingSlotReelItem extends CascadeSlotReelItem {
    @property({ type: cc.Prefab, visible: false, override: true })
    itemPrefabs: cc.Prefab[] = [];

    @property(sp.Skeleton)
    effectSpine: sp.Skeleton = null;

    @property
    premultipliedAlpha = false;

    get cache() {
        return GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] || {};
    }

    protected replaceItem(index: number) {
        if (!this.effectSpine) {
            return;
        }
        const anim = "idle";
        this.effectSpine.skeletonData = this.cache[index];
        this.effectSpine.premultipliedAlpha = this.premultipliedAlpha;
        this.effectSpine.setAnimation(0, anim, true);
    }

    async highlightScatterItem() {
        if (!this.effectSpine) {
            return;
        }
        const anim = "highlight";
        this.effectSpine.skeletonData = this.cache[this.index];
        this.effectSpine.premultipliedAlpha = this.premultipliedAlpha;
        this.effectSpine.setAnimation(0, anim, true);
        const original = this.effectSpine.findAnimation(anim).duration;
        await GameUtils.delayTime(original);
    }
}
