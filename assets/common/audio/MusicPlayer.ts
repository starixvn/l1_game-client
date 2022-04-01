import AudioManager from "./AudioManager";

export default class MusicPlayer {
    private readonly ListSong = ["song1", "song2", "song3", "song4", "song5", "song6"];
    isLoadBgMusic = false;

    public static getInstance(): MusicPlayer {
        if (!this.instanceMusic) {
            this.instanceMusic = new MusicPlayer();
        }

        return this.instanceMusic;
    }

    private static instanceMusic: MusicPlayer;

    stopBgAudio() {
        AudioManager.getInstance().stopMusic();
    }

    getRandomNameSong() {
        return this.ListSong[Math.floor(Math.random() * this.ListSong.length)];
    }

    playBgAudio(play: boolean) {
        if (play) {
            this.loadResourceAudio(this.getRandomNameSong());
            this.isLoadBgMusic = true;
        } else {
            this.stopBgAudio();
            this.isLoadBgMusic = false;
        }
    }

    loadResourceAudio(song: string) {
        !this.isLoadBgMusic &&
            cc.resources.load("music/" + song, cc.AudioClip, (err, audioClip: cc.AudioClip) => {
                const bgMusicId = AudioManager.getInstance().playMusic(audioClip, false);
                cc.audioEngine.setVolume(bgMusicId, 0.7);
                cc.audioEngine.setFinishCallback(bgMusicId, () => {
                    this.isLoadBgMusic = false;
                    this.playBgAudio(true);
                });
            });
    }

    init() {
        const audioManager = AudioManager.getInstance();
        audioManager.addMusicChanged("lobby", (enable: boolean) => {
            this.playBgAudio(enable);
        });
    }
}
