import { AutoScaleWidget } from "./AutoScaleWidget";

const { ccclass, property } = cc._decorator;

@ccclass
export default class IpadAutoScaleWidget extends AutoScaleWidget {
    isIpad(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /ipad/.test(userAgent);
    }

    protected updateDisplay(): void {
        if (!this.isIpad()) {
            return;
        }
        super.updateDisplay();
    }
}
