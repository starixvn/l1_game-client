const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotMascot extends cc.Component {
    @property(sp.Skeleton)
    animation: sp.Skeleton = null;

    onLoad() {
        this.animation.setEndListener(() => {
            if (this.animation.animation === "gunshot") {
                this.playAnimationIdle();
            }
        });
    }

    playAnimationForMultiplier() {
        this.animation.setAnimation(0, "gunshot", false);
    }

    playAnimationIdle() {
        this.animation.setAnimation(0, "Idle", true);
    }
}
