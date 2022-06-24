import AudioManager from "../../common/audio/AudioManager";

export enum CascadingSlotGameSound {
    SPIN_BUTTON = 0,
    SYMBOL_FALL_OUT,
    SYMBOL_DROP_IN,
    SYMBOL_MATCHED,
    MULTIPLIER_SYMBOL_APPEAR,
    BIG_WIN,
    FREE_SPIN,
    TURBO_SYMBOL_FALL_OUT,
    TURBO_SYMBOL_DROP_IN,
    MASCOT_GUN_SHOT
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
