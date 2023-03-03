import StatusButton, { ButtonState } from "../../common/custom-button/StatusButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpineStatusButton extends StatusButton {
    @property(sp.Skeleton)
    animation: sp.Skeleton = null;

    _applyTransition(state) {
        super._applyTransition(state);

        if (this.animation) {
            if (state === ButtonState.HOVER) {
                const entry1 = this.animation.getCurrent(1);
                if (!entry1) {
                    this.animation.setAnimation(1, "hover", true);
                }
            } else {
                this.animation.setAnimation(1, "hover", true);
                this.animation.clearTrack(1);
            }
            state === ButtonState.NORMAL && this.animation.setAnimation(0, "idle", true);
            // state === ButtonState.DISABLED && this.animation.setAnimation(0, "disable", true);
        }
    }
}
