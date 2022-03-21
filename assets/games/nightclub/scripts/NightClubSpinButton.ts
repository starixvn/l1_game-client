import SpinButton from "../../_slotgame_base/SpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NightClubSpinButton extends SpinButton {
    @property(sp.Skeleton)
    effectSkeleton: sp.Skeleton = null;

    @property(sp.Skeleton)
    iconSpinSkeleton: sp.Skeleton = null;

    playAnimationSpin() {
        this.playEffectSpine();
        this.playAnimation(1);
    }

    playEffectSpine() {
        this.effectSkeleton && this.effectSkeleton.setAnimation(0, "anim_highlight", false);
        this.iconSpinSkeleton && this.iconSpinSkeleton.setAnimation(0, "button_quay_quickspin", true);
    }

    playAnimationIdle() {
        this.effectSkeleton && this.effectSkeleton.setAnimation(0, "anim_idle", false);
        this.iconSpinSkeleton && this.iconSpinSkeleton.setAnimation(0, "button_quay_slowspin", true);
        this.playAnimation(0);
    }
}
