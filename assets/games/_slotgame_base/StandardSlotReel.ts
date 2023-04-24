import SlotReel from "./SlotReel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotReel extends SlotReel {
    blurSymbols() {
        this.items.forEach((item) => {
            if (!item.effectSpine || !item.blurSymbol) {
                return;
            }

            const delaySwap = 0.1;
            const delayStart = 0.2;
            const swapDuration = 0.2;
            const delayBetween = this.slotGameConfig.normalMode.spinDuration - 2 * (delayStart + swapDuration);

            cc.tween(this.node)
                .delay(delayStart)
                .call(() => {
                    item.handleBlurAnim(swapDuration, delaySwap, true);
                })
                .delay(delayBetween)
                .call(() => {
                    item.handleBlurAnim(swapDuration, delaySwap, false);
                })
                .start();
        });
    }

    getChangeDataDelayTime(spinDuration: number): number {
        return 0.4 * spinDuration;
    }

    playSpinAnim(spinDuration: number, offset: number, resolve: () => void) {
        const lastDuration = 0.1;
        cc.tween(this.node)
            .to(spinDuration - lastDuration, { position: cc.v2(this.node.x, offset - 10) }, { easing: "quadInOut" })
            .to(lastDuration, { position: cc.v2(this.node.x, offset) }, { easing: "sineIn" })
            .call(() => {
                this.onSpinFinish();
                resolve();
            })
            .start();
    }
}
