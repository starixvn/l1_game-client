import GameUtils from "../../../common/GameUtils";
import CascadeSlotReel from "./CascadeSlotReel";
import CascadeSlotReelItem from "./CascadeSlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardCascadingSlotReel extends CascadeSlotReel {
    async highlightItem(index: number) {
        const item = this.items[index];
        const duration = this.effectSpineSymbol(item, "highlight");
        await GameUtils.delayTime(duration);
    }

    async removeItem(index: number) {
        const item = this.items[index];
        const duration = this.effectSpineSymbol(item, "explode");
        await GameUtils.delayTime(duration);
        item.destroy();
    }

    effectSpineSymbol(item: CascadeSlotReelItem, animation: string): number {
        GameUtils.moveToOtherNode(item.node, this.effectContainer);
        const effectSpine = item.getComponentInChildren(sp.Skeleton);
        effectSpine.setAnimation(0, animation, true);
        const duration = effectSpine.findAnimation(animation).duration;
        return duration;
    }
}
