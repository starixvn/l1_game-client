import AudioManager from "../../common/audio/AudioManager";
import NameSongManager from "../../common/audio/NameSongManager";

const { ccclass } = cc._decorator;

@ccclass
export default abstract class BaseGameSongs extends cc.Component {
    public gameId: number;
    protected readonly audioManager = AudioManager.getInstance();
    protected listSongs: NameSongManager;

    async play() {
        if (!this.audioManager.musicEnabled) {
            return;
        }
        try {
            await this.audioManager.awaitForReady();
            const song = await this.loadAudioClip(this.listSongs.getSongName());
            this.audioManager.playMusic(song, true);
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

    abstract onLoad(): any;
    abstract loadAudioClip(song: string): Promise<cc.AudioClip>;
}
