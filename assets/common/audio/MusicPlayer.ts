import AudioManager from "./AudioManager";

export default class MusicPlayer {
    ListSong = ["song1", "song2", "song3", "song4", "song5", "song6"];
    isLoadMusic = false;

    stopBgAudio() {
        AudioManager.getInstance().stopMusic();
    }
    getRandomNameSong() {
        return this.ListSong[Math.floor(Math.random() * this.ListSong.length)];
    }

    playBgAudio(play: boolean, node: cc.Node) {
        if (play) {
            this.loadResourceAudio(this.getRandomNameSong(), node);
        } else {
            this.stopBgAudio();
        }
    }

    loadResourceAudio(song: string, node: cc.Node) {
        cc.resources.load("music/" + song, cc.AudioClip, (err, audioClip: cc.AudioClip) => {
            const bgMusicId = AudioManager.getInstance().playMusic(audioClip, false);
            cc.audioEngine.setVolume(bgMusicId, 0.7);
            cc.audioEngine.setFinishCallback(bgMusicId, () => {
                this.playBgAudio(true, node);
            });
        });
    }

    init(node: cc.Node) {
        if (!this.isLoadMusic) {
            const audioManager = AudioManager.getInstance();
            audioManager.addMusicChanged("lobby", (enable: boolean) => {
                this.playBgAudio(enable, node);
            });
            this.isLoadMusic = true;
        }
    }
}
