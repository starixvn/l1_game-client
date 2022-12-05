import ClassicSpinButton from "../../_slotgame_base/ClassicSpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FortuneCatSpinButton extends ClassicSpinButton {
    @property({ visible: false, override: true })
    autoSpinCountLabel: cc.Label = null;

    @property(sp.Skeleton)
    iconSpinSkeleton: sp.Skeleton = null;

    onLoad() {
        this.hideAutoSpin();
    }

    override playAnimationSpin() {
        this.iconSpinSkeleton && this.iconSpinSkeleton.setAnimation(0, "active", true);
    }

    override playAnimationIdle() {
        this.iconSpinSkeleton && this.iconSpinSkeleton.setAnimation(0, "idle", true);
    }
}
