import { lodash } from "../../../ClientModules";
import AudioManager from "../../../common/audio/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameSongs extends cc.Component {
    @property(cc.AudioClip)
    songList: cc.AudioClip[] = [];

    async play() {
        await AudioManager.getInstance().awaitForReady();
        if (AudioManager.getInstance().musicEnabled) {
            const song = this.songList[lodash.random(this.songList.length - 1)];
            AudioManager.getInstance().playMusic(song, true);
        }
    }

    stop() {
        AudioManager.getInstance().stopMusic();
    }

    onDestroy() {
        this.stop();
    }
}
