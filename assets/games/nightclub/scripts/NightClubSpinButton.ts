import ClassicSpinButton from "../../_slotgame_base/ClassicSpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NightClubSpinButton extends ClassicSpinButton {
    @property(sp.Skeleton)
    effectSkeleton: sp.Skeleton = null;

    @property(sp.Skeleton)
    iconSpinSkeleton: sp.Skeleton = null;

    override playAnimationSpin() {
        this.effectSkeleton && this.effectSkeleton.setAnimation(0, "anim_highlight", false);
        this.iconSpinSkeleton && this.iconSpinSkeleton.setAnimation(0, "button_quay_quickspin", true);
    }

    override playAnimationIdle() {
        this.effectSkeleton && this.effectSkeleton.setAnimation(0, "anim_idle", false);
        this.iconSpinSkeleton && this.iconSpinSkeleton.setAnimation(0, "button_quay_slowspin", true);
    }
}
