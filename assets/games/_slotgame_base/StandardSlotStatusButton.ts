import StatusButton, { ButtonState } from "../../common/custom-button/StatusButton";
import StandardSlotSpinButton from "./StandardSlotSpinButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotStatusButton extends StatusButton {
    _applyTransition(state) {
        super._applyTransition(state);
        const animation = this.node.getComponent(StandardSlotSpinButton).iconSpinSkeleton;
        if (animation) {
            state === ButtonState.HOVER && animation.setAnimation(0, "hover", true);
            state === ButtonState.NORMAL && animation.setAnimation(0, "idle", true);
        }

        if (this.activeNode) {
            this.activeNode.active = state === ButtonState.HOVER || state === ButtonState.PRESSED;
        }
        if (this.disableNode) {
            this.disableNode.active = state === ButtonState.DISABLED;
        }
    }
}
