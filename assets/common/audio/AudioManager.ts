const MusicStorageKey = "SOUND_BACKGROUND";
const SFXStorageKey = "SOUND_GAME";
export default class AudioManager {
    public clickAudio: cc.AudioClip = null;

    public static getInstance(): AudioManager {
        if (!this.instance) {
            this.instance = new AudioManager();
        }

        return this.instance;
    }

    private static instance: AudioManager;

    constructor() {
        this.init();
    }

    readonly soundObservers = { music: {}, sfx: {} };

    private init() {
        this.initDefaultStorage();
    }

    playClick() {
        if (this.clickAudio) {
            this.playSFX(this.clickAudio);
        }
    }

    playSFX(clip: cc.AudioClip): number {
        if (this.sfxEnabled && clip) {
            return cc.audioEngine.playEffect(clip, false);
        }
        return -1;
    }

    stopSFX(audioId: number) {
        cc.audioEngine.stopEffect(audioId);
    }

    stopAllSFX() {
        cc.audioEngine.stopAllEffects();
    }

    playMusic(clip: cc.AudioClip, loop: boolean) {
        if (this.musicEnabled && clip) {
            return cc.audioEngine.playMusic(clip, loop);
        }
        return -1;
    }

    stopMusic() {
        cc.audioEngine.stopMusic();
    }

    private initDefaultStorage() {
        const background = cc.sys.localStorage.getItem(MusicStorageKey);
        if (background === "") {
            this.musicEnabled = true;
        }

        const sfx = cc.sys.localStorage.getItem(SFXStorageKey);
        if (sfx === "") {
            this.sfxEnabled = true;
        }
    }

    addMusicChanged(key: string, observer: (changed: boolean) => void) {
        this.soundObservers["music"][key] = observer;
    }

    removeMusicChanged(key: string) {
        delete this.soundObservers["music"][key];
    }

    addSfxChanged(key: string, observer: (changed: boolean) => void) {
        this.soundObservers["sfx"][key] = observer;
    }

    removeSfxChanged(key: string) {
        delete this.soundObservers["sfx"][key];
    }

    private onMusicChanged(value: boolean) {
        const observers = this.soundObservers["music"];
        this.callObservers(observers, value);
    }

    private onSfxChanged(value: boolean) {
        const observers = this.soundObservers["sfx"];
        this.callObservers(observers, value);
    }

    private callObservers(observers: any, value: boolean) {
        Object.keys(observers).forEach((key) => {
            const observer = observers[key];
            observer(value);
        });
    }

    get musicEnabled(): boolean {
        const check = cc.sys.localStorage.getItem(MusicStorageKey);
        return check === "true";
    }

    set musicEnabled(value: boolean) {
        cc.sys.localStorage.setItem(MusicStorageKey, value);
        this.onMusicChanged(value);
    }

    get sfxEnabled(): boolean {
        const check = cc.sys.localStorage.getItem(SFXStorageKey);
        return check === "true";
    }

    set sfxEnabled(value: boolean) {
        cc.sys.localStorage.setItem(SFXStorageKey, value);
        this.onSfxChanged(value);
    }
}
