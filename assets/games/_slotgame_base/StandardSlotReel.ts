import SlotReel from "./SlotReel";
import SlotReelItem from "./SlotReelItem";

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
                    this.handleBlurAnim(item, swapDuration, delaySwap, true);
                })
                .delay(delayBetween)
                .call(() => {
                    this.handleBlurAnim(item, swapDuration, delaySwap, false);
                })
                .start();
        });
    }

    getReelDataDelayTime(spinDuration: number): number {
        return 0.4 * spinDuration;
    }

    handleBlurAnim(item: SlotReelItem, swapDuration: number, delaySwap: number, isShowBlurSymbol: boolean) {
        cc.tween(item.blurSymbol)
            .to(swapDuration, { opacity: isShowBlurSymbol ? 255 : 0 })
            .start();
        cc.tween(item.effectSpine.node)
            .delay(delaySwap)
            .to(swapDuration, { opacity: isShowBlurSymbol ? 0 : 255 })
            .start();
    }
}
