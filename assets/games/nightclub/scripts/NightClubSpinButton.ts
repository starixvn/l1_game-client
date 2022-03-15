import SpinButton from "../../_slotgame_base/SpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NightClubSpinButton extends SpinButton {
    @property(sp.Skeleton)
    effectSkeleton: sp.Skeleton = null;

    playAnimationSpin() {
        this.playEffectSpine();
        this.playAnimation(1);
    }

    playEffectSpine() {
        this.effectSkeleton && this.effectSkeleton.setAnimation(0, "btn_quay_vfx", false);
    }
}
