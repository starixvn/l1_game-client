import GameUIManager from "../../lobby/main/view-models/GameUIManager";
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

    public addWinningEffect(prefab: cc.Prefab) {
        const node = cc.instantiate(prefab);
        this.winningEffect.addChild(node);
    }

    protected replaceItem(index: number) {
        const node = this.content.children[0];

        const cache = GameUIManager.getInstance().prefabCache.slotSymbols[this.gameId] || {};
        const spine = node.getComponent(sp.Skeleton);
        if (spine) {
            const anim = "idle";
            spine.skeletonData = cache[index];
            spine.premultipliedAlpha = this.premultipliedAlpha;
            spine.setAnimation(0, anim, true);
        }
    }

    showWinningEffect(show: boolean) {
        this.winningEffect.active = show;
        this.content.children.forEach((child) => {
            const spine = child.getComponent(sp.Skeleton);
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
