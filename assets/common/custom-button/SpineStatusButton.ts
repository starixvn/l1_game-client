import StatusButton, { ButtonState } from "../../common/custom-button/StatusButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpineStatusButton extends StatusButton {
    @property(sp.Skeleton)
    animation: sp.Skeleton = null;

    _applyTransition(state) {
        super._applyTransition(state);

        if (this.animation) {
            state === ButtonState.HOVER && this.animation.setAnimation(0, "hover", true);
            state === ButtonState.NORMAL && this.animation.setAnimation(0, "idle", true);
        }
    }
}
