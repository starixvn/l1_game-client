import AudioManager from "../../common/audio/AudioManager";

export enum CascadingSlotGameSound {
    SPIN_BUTTON = "spin_button",
    FALL_OUT = "fall_out",
    DROP_IN = "drop_in",
    MATCHED_1 = "matched_1",
    MATCHED_2 = "matched_2",
    MATCHED_3 = "matched_3",
    MATCHED_4 = "matched_4",
    MULTIPLIER_APPEAR = "multiplier_appear",
    BIG_WIN = "big_win",
    BIG_WIN_STOP = "big_win_end",
    FREE_SPIN = "free_spin",
    TURBO_FALL_OUT = "turbo_fall_out",
    TURBO_DROP_IN = "turbo_drop_in",
    REEL_STOP = "reel_stop0",
    REEL_STOP_1 = "reel_stop1",
    REEL_STOP_2 = "reel_stop2",
    REEL_STOP_3 = "reel_stop3",
    REEL_STOP_4 = "reel_stop4",
    REEL_STOP_5 = "reel_stop5",
    SYMBOL_EXPLODE = "explode",
    INCREMENT = "increment",
    INCREMENT_STOP = "increment_stop",
    REELHAVEMULTIPLIER = "special_symbol_land"
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameSound extends cc.Component {
    soundSources = {};

    onLoad() {
        this.node.children.forEach((node) => {
            this.soundSources[node.name] = node.getComponent(cc.AudioSource);
        });
    }

    playSound(type: CascadingSlotGameSound) {
        this.soundSources[type] && AudioManager.getInstance().playSFXSource(this.soundSources[type]);
    }

    stopSound(type: CascadingSlotGameSound) {
        this.soundSources[type].stop();
    }
}
