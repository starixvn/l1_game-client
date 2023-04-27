import SlotReel from "./SlotReel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotReel extends SlotReel {
    itemCountPerReel = 24;

    blurSymbols() {
        this.items.forEach((item, index) => {
            if (!item.effectSpine || !item.blurSymbol) {
                return;
            }

            // const delaySwap = 0.1;
            // const delayStart = 0.1;
            // const swapDuration = 0.1;
            // const delayBetween =
            //     (this.slotGameConfig.normalMode.spinDuration * this.itemCount) / this.itemCountPerReel - 2 * (delayStart + swapDuration);

            // cc.tween(this.node)
            //     .delay(delayStart)
            //     .call(() => {
            //         item.handleBlurAnim(swapDuration, delaySwap, true);
            //     })
            //     .delay(delayBetween)
            //     .call(() => {
            //         item.handleBlurAnim(swapDuration, delaySwap, false);
            //     })
            //     .start();
            if (index < 4 || index >= this.itemCount - 4) {
                item.handleBlurAnim(false);
            } else {
                item.handleBlurAnim(true);
            }
            //item.handleBlurAnim(true);
        });
    }

    getChangeDataDelayTime(spinDuration: number): number {
        return 0.4 * spinDuration;
    }

    spinWithData(spinDuration = 1.25, data: number[], turbo: boolean) {
        spinDuration = (spinDuration * this.itemCount) / this.itemCountPerReel;
        return super.spinWithData(spinDuration, data, turbo);
    }

    playSpinAnim(spinDuration: number, offset: number, resolve: () => void) {
        const moveUpDuration = 0.25;
        const moveDownDuration = 0.35;
        const normalSpinDuration = spinDuration - moveUpDuration - moveDownDuration;

        cc.tween(this.node)
            .to(moveUpDuration, { position: cc.v2(this.node.x, -300) }, { easing: "backIn" })
            .to(normalSpinDuration, { position: cc.v2(this.node.x, offset + 300) })
            .to(moveDownDuration, { position: cc.v2(this.node.x, offset) }, { easing: "backOut" })

            .call(() => {
                this.onSpinFinish();
                resolve();
            })
            .start();
    }
}
