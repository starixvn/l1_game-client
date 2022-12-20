import { BundleManager } from "bundle-management";

import { lodash } from "../../../ClientModules";
import AudioManager from "../../../common/audio/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameSongs extends cc.Component {
    @property
    songNumber: number = 3;

    gameId: number;

    async play() {
        await AudioManager.getInstance().awaitForReady();
        if (AudioManager.getInstance().musicEnabled) {
            const song = await this.loadAudioClip(lodash.random(this.songNumber - 1));
            AudioManager.getInstance().playMusic(song, true);
        }
    }

    stop() {
        AudioManager.getInstance().stopMusic();
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
