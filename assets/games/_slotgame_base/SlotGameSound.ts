import AudioManager from "../../common/audio/AudioManager";

export enum CascadingSlotGameSound {
    SPIN_BUTTON = 0,
    SYMBOL_FALL_OUT = 2,
    SYMBOL_DROP_IN = 3,
    SYMBOL_MATCHED = 4,
    MULTIPLIER_SYMBOL_APPEAR = 5,
    BIG_WIN = 6,
    FREE_SPIN = 7,
    TURBO_SYMBOL_FALL_OUT = 8,
    TURBO_SYMBOL_DROP_IN = 9
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameSound extends cc.Component {
    @property({ type: cc.AudioSource })
    soundSources: cc.AudioSource[] = [];

    playSound(type: CascadingSlotGameSound) {
        this.soundSources[type] && AudioManager.getInstance().playSFX(this.soundSources[type].clip);
    }
}
