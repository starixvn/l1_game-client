import { SystemType } from "./../../ISystem";
import AudioManager from "../../common/audio/AudioManager";
import NameSongManager, { IDataSongs } from "../../common/audio/NameSongManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class BaseGameSongs extends cc.Component {
    @property
    volume = 1;

    public gameId: number;
    protected readonly audioManager = AudioManager.getInstance();
    protected nameSongManager = new NameSongManager({
        [SystemType.SC1]: ["song1"],
        [SystemType.SC2]: ["song1"]
    });

    public setListSongs(data: IDataSongs) {
        this.nameSongManager.songs = data;
    }

    async play() {
        if (!this.audioManager.musicEnabled) {
            return;
        }
        try {
            await this.audioManager.awaitForReady();
            const song = await this.loadAudioClip(this.nameSongManager.getSongName());
            const musicId = this.audioManager.playMusic(song, true);
            cc.audioEngine.setVolume(musicId, this.volume);
        } catch (e) {
            console.warn("Catch error after await method", e.message);
        }
    }

    public stop() {
        this.audioManager.stopMusic();
    }

    public onDestroy() {
        this.stop();
    }

    abstract loadAudioClip(song: string): Promise<cc.AudioClip>;
}
