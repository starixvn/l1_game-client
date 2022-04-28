import AudioManager from "./AudioManager";

export default class MusicPlayer {
    private readonly ListSong = ["song1", "song2", "song3", "song4", "song5", "song6"];
    public isPlayBgMusic = false;
    public isJoinRoomMusic = false;
    protected bgMusicId: number;
    readonly volumeDefault = 0.7;
    readonly musicChangedKey = "lobby";
    protected intervalVolDecrease: NodeJS.Timeout;
    protected intervalVolIncrease: NodeJS.Timeout;
    protected volume = 0.7;
    readonly stepVolume = 0.05;
    readonly duration = 3.5;
    readonly stepIntervalVolume = (this.duration * 1000) / (this.volume / this.stepVolume);
    private static instanceMusic: MusicPlayer;

    public static getInstance(): MusicPlayer {
        if (!this.instanceMusic) {
            this.instanceMusic = new MusicPlayer();
        }

        return this.instanceMusic;
    }

    get delayTurnOffMusicBg() {
        return this.duration;
    }

    private get audioManager() {
        return AudioManager.getInstance();
    }

    set joinRoomMusic(status: boolean) {
        this.isJoinRoomMusic = status;
    }

    stopBackgroundAudio() {
        this.isPlayBgMusic = false;
        this.audioManager.stopMusic();
        this.bgMusicId && cc.audioEngine.stop(this.bgMusicId);
        this.bgMusicId = -1;
    }

    private getRandomNameSong() {
        return this.ListSong[Math.floor(Math.random() * this.ListSong.length)];
    }

    private playBgAudio(play: boolean) {
        this.clearIntervalSetVolume();
        this.isJoinRoomMusic && this.audioManager.removeMusicChanged(this.musicChangedKey);
        if (play && !this.isJoinRoomMusic) {
            this.loadResourceAudio(this.getRandomNameSong());
            this.isPlayBgMusic = true;
        }
        if (!play && this.isPlayBgMusic) {
            this.stopBackgroundAudio();
        }
    }

    private loadResourceAudio(song: string) {
        !this.isPlayBgMusic &&
            cc.resources.load("music/" + song, cc.AudioClip, (err, audioClip: cc.AudioClip) => {
                this.bgMusicId && cc.audioEngine.stop(this.bgMusicId);
                this.bgMusicId = this.audioManager.playMusic(audioClip, false);
                cc.audioEngine.setVolume(this.bgMusicId, this.volumeDefault);
                cc.audioEngine.setFinishCallback(this.bgMusicId, () => {
                    this.isPlayBgMusic = false;
                    this.playBgAudio(true);
                });
            });
    }

    init() {
        this.joinRoomMusic = false;
        this.playBgAudio(this.audioManager.musicEnabled);
        this.audioManager.addMusicChanged(this.musicChangedKey, (enable: boolean) => {
            this.playBgAudio(enable);
        });
    }

    decreaseVolumeAndStopBackgroundMusic() {
        this.clearIntervalSetVolume();
        if (this.isPlayBgMusic) {
            this.volume = this.volumeDefault;
            this.handleDecreaseVolume();
            this.intervalVolDecrease = setInterval(() => {
                this.handleDecreaseVolume();
            }, this.stepIntervalVolume);
        }
    }

    private handleDecreaseVolume() {
        cc.audioEngine.setVolume(this.bgMusicId, this.volume);
        this.volume -= this.stepVolume;
        if (this.volume <= 0) {
            clearInterval(this.intervalVolDecrease);
            this.stopBackgroundAudio();
        }
    }

    private clearIntervalSetVolume() {
        this.intervalVolDecrease && clearInterval(this.intervalVolDecrease);
        this.intervalVolIncrease && clearInterval(this.intervalVolIncrease);
    }

    handleIncreaseVolume() {
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
