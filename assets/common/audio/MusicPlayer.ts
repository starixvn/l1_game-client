import AudioManager from "./AudioManager";

export default class MusicPlayer {
    private readonly ListSong = ["song1", "song2", "song3", "song4", "song5", "song6"];
    public isPlayBgMusic = false;
    protected bgMusicId: number;
    readonly volumeDefault = 0.7;
    readonly musicChangedKey = "lobby";
    protected intervalVolDecrease: NodeJS.Timeout;
    protected intervalVolIncrease: NodeJS.Timeout;
    protected volume = 0.7;
    readonly stepVolume = 0.05;
    readonly duration = 3.5;
    readonly stepIntervalVolume = (this.duration * 1000) / (this.volume / this.stepVolume);

    public static getInstance(): MusicPlayer {
        if (!this.instanceMusic) {
            this.instanceMusic = new MusicPlayer();
        }

        return this.instanceMusic;
    }

    get delayTurnOffMusicBg() {
        return this.duration;
    }

    private static instanceMusic: MusicPlayer;

    stopBgAudio() {
        this.isPlayBgMusic = false;
        AudioManager.getInstance().stopMusic();
    }

    getRandomNameSong() {
        return this.ListSong[Math.floor(Math.random() * this.ListSong.length)];
    }

    playBgAudio(play: boolean) {
        this.clearIntervalSetVolume();
        if (play) {
            this.loadResourceAudio(this.getRandomNameSong());
            this.isPlayBgMusic = true;
        } else {
            if (this.isPlayBgMusic) {
                this.stopBgAudio();
            }
        }
    }

    loadResourceAudio(song: string) {
        !this.isPlayBgMusic &&
            cc.resources.load("music/" + song, cc.AudioClip, (err, audioClip: cc.AudioClip) => {
                this.bgMusicId && cc.audioEngine.stop(this.bgMusicId);
                this.bgMusicId = AudioManager.getInstance().playMusic(audioClip, false);
                cc.audioEngine.setVolume(this.bgMusicId, this.volumeDefault);
                cc.audioEngine.setFinishCallback(this.bgMusicId, () => {
                    this.isPlayBgMusic = false;
                    this.playBgAudio(true);
                });
            });
    }

    init() {
        const audioManager = AudioManager.getInstance();
        this.playBgAudio(audioManager.musicEnabled);
        audioManager.addMusicChanged(this.musicChangedKey, (enable: boolean) => {
            this.playBgAudio(enable);
        });
    }

    stopMusicBg() {
        this.clearIntervalSetVolume();
        if (this.isPlayBgMusic) {
            this.volume = this.volumeDefault;
            this.decreaseVolume();
            this.intervalVolDecrease = setInterval(() => {
                this.decreaseVolume();
            }, this.stepIntervalVolume);
        } else {
            this.stopBgAudio();
        }
    }

    decreaseVolume() {
        cc.audioEngine.setVolume(this.bgMusicId, this.volume);
        this.volume -= this.stepVolume;
        if (this.volume <= 0) {
            clearInterval(this.intervalVolDecrease);
            AudioManager.getInstance().stopMusicWithChangedKey(this.musicChangedKey);
            this.isPlayBgMusic = false;
            this.bgMusicId && cc.audioEngine.stop(this.bgMusicId);
            this.bgMusicId = -1;
        }
    }

    clearIntervalSetVolume() {
        this.intervalVolDecrease && clearInterval(this.intervalVolDecrease);
        this.intervalVolIncrease && clearInterval(this.intervalVolIncrease);
    }

    increaseVolume() {
        this.clearIntervalSetVolume();
        if (this.bgMusicId > -1) {
            this.intervalVolIncrease = setInterval(() => {
                cc.audioEngine.setVolume(this.bgMusicId, this.volume);
                this.volume += this.stepVolume;
                this.volume >= 0.7 && clearInterval(this.intervalVolIncrease);
            }, this.stepIntervalVolume);
        }
    }
}
