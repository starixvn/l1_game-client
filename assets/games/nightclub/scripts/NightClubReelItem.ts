import SlotReelItem from "../../_slotgame_base/SlotReelItem";
import NightClubSubReelItem from "./NightClubSubReelItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NightClubReelItem extends SlotReelItem {
    @property({ visible: false, override: true })
    winningEffect: cc.Node = null;

    @property({ visible: false, override: true })
    effectSpine: sp.Skeleton = null;

    showWinningEffect(show: boolean) {
        this.content.children.forEach((child) => {
            const spine = child.getComponentInChildren(sp.Skeleton);
            if (spine) {
                const anim = show ? "highlight" : "idle";
                spine.setAnimation(0, anim, true);
            }
            const node = spine.node.getChildByName("winningEffect");
            if (node) {
                node.active = show;
            }
        });
    }
}
