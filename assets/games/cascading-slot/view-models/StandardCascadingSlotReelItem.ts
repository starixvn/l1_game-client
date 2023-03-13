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
    private cache: any;

    onLoad() {
        this.cache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] || {};
    }

    protected replaceItem(index: number) {
        if (this.effectSpine) {
            const anim = "idle";
            this.effectSpine.skeletonData = this.cache[index];
            this.effectSpine.premultipliedAlpha = this.premultipliedAlpha;
            this.effectSpine.setAnimation(0, anim, true);
        }
    }

    async highlightScatterItem() {
        if (this.index === 9) {
            const anim = "highlight";
            this.effectSpine.skeletonData = this.cache[this.index];
            this.effectSpine.premultipliedAlpha = this.premultipliedAlpha;
            this.effectSpine.setAnimation(0, anim, true);
            const original = this.effectSpine.findAnimation("highlight").duration;
            await GameUtils.delayTime(original);
        }
    }
}
