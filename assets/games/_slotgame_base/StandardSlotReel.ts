import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";
import { ClassicSlotSound } from "./ClassicSlotSound";
import SlotGameBase from "./SlotGameBase";
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

            if (index < 4 || index >= this.itemCount - 4) {
                item.handleBlurAnim(false);
            } else {
                item.handleBlurAnim(true);
            }
        });
    }

    normalSymbols() {
        this.items.forEach((item) => {
            if (!item.effectSpine || !item.blurSymbol) {
                return;
            }
            item.handleBlurAnim(false);
        });
    }

    getChangeDataDelayTime(spinDuration: number): number {
        return 0.4 * spinDuration;
    }

    spinWithData(spinDuration: number, data: number[], turbo: boolean) {
        if (!turbo) {
            spinDuration = (spinDuration * this.itemCount) / this.itemCountPerReel;
        }
        return super.spinWithData(spinDuration, data, turbo);
    }

    checkSpinAnimReel(turbo: boolean, spinDuration: number, offset: number, resolve: () => void) {
        if (!turbo) {
            this.playSpinAnim(spinDuration, offset, resolve);
            this.blurSymbols();
        } else {
            this.playSpinAnimTurbo(spinDuration, offset, resolve);
            this.normalSymbols();
        }
    }

    playSpinAnimTurbo(spinDuration: number, offset: number, resolve: () => void) {
        cc.tween(this.node)
            .to(spinDuration, { position: cc.v2(this.node.x, offset) }, { easing: (dt) => cc.easeInOut(3).easing(dt) })
            .call(() => {
                this.onSpinFinish();
                resolve();
            })
            .start();
    }
    playSpinAnim(spinDuration: number, offset: number, resolve: () => void) {
        const moveDownDuration = 0.25;
        const moveUpDuration = 0.35;
        const normalSpinDuration = spinDuration - moveUpDuration - moveDownDuration;

        cc.tween(this.node)
            .to(moveDownDuration, { position: cc.v2(this.node.x, -300) }, { easing: "backIn" })
            .to(normalSpinDuration, { position: cc.v2(this.node.x, offset + 300) })
            .to(moveUpDuration, { position: cc.v2(this.node.x, offset) }, { easing: "backOut" })

            .call(() => {
                this.onSpinFinish();
                resolve();
            })
            .start();
        cc.tween(this.node)
            .delay(spinDuration - 0.15)
            .call(() => {
                uiManager.emitter.emit(InternalEvents.SLOT_PLAY_SOUND, ClassicSlotSound.REEL_STOP);
            })
            .start();
    }
}
