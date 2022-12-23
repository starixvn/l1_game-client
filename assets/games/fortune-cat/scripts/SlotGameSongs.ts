import { BundleManager } from "bundle-management";

import { lodash } from "../../../ClientModules";
import AudioManager from "../../../common/audio/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameSongs extends cc.Component {
    @property
    songNumber: number = 3;

    gameId: number;
    private readonly audioManager = AudioManager.getInstance();

    async play() {
        if (!this.audioManager.musicEnabled) {
            return;
        }
        try {
            await this.audioManager.awaitForReady();
            const song = await this.loadAudioClip(lodash.random(this.songNumber - 1));
            this.audioManager.playMusic(song, true);
        } catch (e) {
            console.warn("Catch error after await method", e.message);
        }
    }

    stop() {
        this.audioManager.stopMusic();
    }

    onDestroy() {
        this.stop();
    }

    public loadAudioClip(songID: number): Promise<cc.AudioClip> {
        return BundleManager.getInstance().loadAsset<cc.AudioClip>({
            bundleId: this.gameId.toString(),
            path: `/audio/background-music/song${songID + 1}`,
            type: cc.AudioClip
        });
    }
}
