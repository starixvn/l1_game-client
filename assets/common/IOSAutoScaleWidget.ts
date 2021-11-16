import { AutoScaleWidget } from "./AutoScaleWidget";

const { ccclass, property } = cc._decorator;

@ccclass
export default class IOSAutoScaleWidget extends AutoScaleWidget {
    isIOS(): boolean {
        return cc.sys.isMobile;
    }

    protected updateDisplay(): void {
        if (!this.isIOS()) {
            return;
        }
        super.updateDisplay();
    }
}
