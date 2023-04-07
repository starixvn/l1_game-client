import GameUtils from "../../common/GameUtils";
import { uiManager } from "../../managers/GameUIManager";
import SlotReelItem from "./SlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotReelItem extends SlotReelItem {
    @property({ type: cc.Prefab, visible: false, override: true })
    itemPrefabs: cc.Prefab[] = [];

    @property
    premultipliedAlpha = false;

    onLoad() {
        super.onLoad();
    }

    public addWinningEffect() {
        const cache = uiManager.prefabCache.slotWinningAnimation[this.gameId] || {};
        const spine = this.winningEffect.getComponent(sp.Skeleton);
        spine.skeletonData = cache;
        spine.premultipliedAlpha = this.premultipliedAlpha;
        spine.setAnimation(0, "highlight", true);
    }

    protected replaceItem(index: number, duration = 0) {
        const cache = uiManager.prefabCache.slotSymbols[this.gameId] || {};

        if (this.effectSpine) {
            const anim = "idle";
            this.effectSpine.skeletonData = cache[index];
            this.effectSpine.premultipliedAlpha = this.premultipliedAlpha;
            this.effectSpine.setAnimation(0, anim, true);
        }
    }

    showWinningEffect(show: boolean) {
        this.winningEffect.active = show;
        if (this.effectSpine) {
            const anim = show ? "highlight" : "idle";
            this.effectSpine.setAnimation(0, anim, true);
        }
        this.showMoreEffect(this.effectSpine.node, show);
    }

    showMoreEffect(node: cc.Node, show: boolean) {
        const effectNode = node.getChildByName("winningEffect");
        if (effectNode) {
            effectNode.active = show;
        }
    }

    updateDuration(duration: number) {
        GameUtils.updateSpineDuration(this.effectSpine, "highlight", duration);
    }
}
