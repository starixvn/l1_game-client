import AudioManager from "./AudioManager";

export default class MusicPlayer {
    private readonly ListSong = ["song1", "song2", "song3", "song4", "song5", "song6"];
    public isLoadBgMusic = false;
    protected bgMusicId: number;
    readonly volumeDefault = 0.7;
    readonly nameMusicChanged = "lobby";
    protected intervalVolDecrease: NodeJS.Timeout;
    protected intervalVolIncrease: NodeJS.Timeout;
    protected volume = 0.7;
    readonly stepVolume = 0.1;

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
                this.bgMusicId = AudioManager.getInstance().playMusic(audioClip, false);
                cc.audioEngine.setVolume(this.bgMusicId, this.volumeDefault);
                cc.audioEngine.setFinishCallback(this.bgMusicId, () => {
                    this.isLoadBgMusic = false;
                    this.playBgAudio(true);
                });
            });
    }

    init() {
        const audioManager = AudioManager.getInstance();
        audioManager.addMusicChanged(this.nameMusicChanged, (enable: boolean) => {
            this.playBgAudio(enable);
        });
    }

    stopMusicBgJoinRoom() {
        this.volume = this.volumeDefault;
        this.intervalVolDecrease = setInterval(() => {
            cc.audioEngine.setVolume(this.bgMusicId, this.volume);
            this.volume -= this.stepVolume;
            this.volume <= 0 && clearInterval(this.intervalVolDecrease);
        }, 500);
    }

    clearIntervalSetVolume() {
        this.intervalVolDecrease && clearInterval(this.intervalVolDecrease);
        this.intervalVolIncrease && clearInterval(this.intervalVolIncrease);
    }

    setVolumeDefaultMusicBg() {
        cc.audioEngine.setVolume(this.bgMusicId, this.volumeDefault);
    }

    playMusicBgOutSwiftRoom() {
        this.intervalVolIncrease = setInterval(() => {
            cc.audioEngine.setVolume(this.bgMusicId, this.volume);
            this.volume += this.stepVolume;
            this.volume >= 0.7 && clearInterval(this.intervalVolIncrease);
        }, 500);
    }
}
