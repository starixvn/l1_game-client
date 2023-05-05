import GameUtils from "../../../common/GameUtils";
import { uiManager } from "../../../managers/GameUIManager";
import MultiplierItem from "./MultiplierItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardMultiplierItem extends MultiplierItem {
    gameId: number;
    private spine: sp.Skeleton;

    get cache() {
        return uiManager.prefabCache.slotSymbols[this.gameId] || {};
    }

    async playAnimationGlow() {
        try {
            const anim = "highlight";
            this.spine = this.node.getComponent(sp.Skeleton);
            this.spine.skeletonData = this.cache[10];
            this.spine.setAnimation(0, anim, true);
            const duration = this.spine.findAnimation(anim)?.duration || 0;
            GameUtils.updateSpineDuration(this.spine, anim, duration);
            if (duration > 0) {
                await GameUtils.delayTime(duration);
            }
            this.hideMultiplier();
        } catch (e) {
            console.warn("Catch error after await method", e.message);
        }
    }

    protected hideMultiplier() {
        this.value.node.active = false;
        this.spine.setAnimation(0, "idle", true);
    }
}
