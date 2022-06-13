import _ = require("lodash");

import AudioManager from "./AudioManager";

export default class MusicPlayer {
    private readonly ListSong = ["song1", "song2", "song3", "song4", "song5", "song6", "song7"];
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
    private lastLoadSongTask: { promise: Promise<cc.AudioClip>; cancel: () => void };

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
        return this.ListSong[_.random(this.ListSong.length - 1)];
    }

    private playBgAudio(play: boolean) {
        this.clearIntervalSetVolume();
        this.isJoinRoomMusic && this.audioManager.removeMusicChanged(this.musicChangedKey);

        if (play && !this.isJoinRoomMusic) {
            this.loadResourceAudio(this.getRandomNameSong());
            this.isPlayBgMusic = true;
        } else {
            this.stopBackgroundAudio();
        }
    }

    private loadAudio(song: string) {
        let reject;
        const promise = new Promise<cc.AudioClip>((resolve, rejectInPromise) => {
            reject = rejectInPromise;
            cc.resources.load("music/" + song, cc.AudioClip, (err, audioClip: cc.AudioClip) => {
                resolve(audioClip);
            });
        });

        return {
            promise,
            cancel: () => {
                reject && reject();
            }
        };
    }

    private async loadResourceAudio(song: string) {
        if (this.lastLoadSongTask) {
            this.lastLoadSongTask.cancel();
        }
        this.lastLoadSongTask = this.loadAudio(song);

        const audioClip = await this.lastLoadSongTask.promise;
        if (this.isPlayBgMusic) {
            this.bgMusicId && cc.audioEngine.stop(this.bgMusicId);
            this.bgMusicId = this.audioManager.playMusic(audioClip, false);
            cc.audioEngine.setVolume(this.bgMusicId, this.volumeDefault);
            cc.audioEngine.setFinishCallback(this.bgMusicId, () => {
                this.stopBackgroundAudio();
                this.playBgAudio(true);
            });
        }
    }

    init() {
        this.joinRoomMusic = false;
        if (!this.isPlayBgMusic) {
            this.playBgAudio(this.audioManager.musicEnabled);
        }
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
