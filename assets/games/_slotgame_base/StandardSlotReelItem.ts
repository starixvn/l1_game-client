import GameUIManager from "../../lobby/main/view-models/GameUIManager";
import SlotReelItem from "./SlotReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotReelItem extends SlotReelItem {
    @property({ type: cc.Prefab, visible: false, override: true })
    itemPrefabs: cc.Prefab[] = [];

    protected getItemPrefab(index: number): cc.Prefab {
        const prefabCache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] || {};
        return prefabCache[index];
    }

    showWinningEffect(show: boolean) {
        this.content.children.forEach((child) => {
            const spine = child.getChildByName("icon").getComponent(sp.Skeleton);
            if (spine) {
                const anim = show ? "highlight" : "idle";
                spine.setAnimation(0, anim, true);
            }
            this.showMoreEffect(child, show);
        });
    }
    showMoreEffect(node: cc.Node, show: boolean) {
        const effectNode = node.getChildByName("winningEffect");
        if (effectNode) {
            effectNode.active = show;
        }
    }
}
