import AudioManager from "./audio/AudioManager";

const { ccclass, property } = cc._decorator;

enum AudioType {
    Music = 0,
    SFX
}

@ccclass
export default class HandleGameSound extends cc.Component {
    @property(cc.Sprite)
    soundSprite: cc.Sprite = null;

    @property(cc.SpriteFrame)
    soundOnFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    soundOffFrame: cc.SpriteFrame = null;

    @property({ type: cc.Enum(AudioType) })
    type = AudioType.SFX;

    isFirst = false;

    onLoad() {
        this.node.on("click", this.onClickSoundGame, this);
        this.updateIcon(AudioManager.getInstance()[this.getKey()]);
    }

    onDestroy() {
        this.node.off("click", this.onClickSoundGame, this);
    }

    private getKey(): string {
        const dict = ["musicEnabled", "sfxEnabled"];
        return dict[this.type];
    }

    onClickSoundGame() {
        AudioManager.getInstance()[this.getKey()] ? this.toggleSoundOff() : this.toggleSoundOn();
    }

    updateIcon(enable: boolean) {
        this.soundSprite.spriteFrame = enable ? this.soundOnFrame : this.soundOffFrame;
    }

    toggleSoundOn() {
        AudioManager.getInstance()[this.getKey()] = true;
        this.updateIcon(true);
    }

    toggleSoundOff() {
        AudioManager.getInstance()[this.getKey()] = false;
        this.updateIcon(false);
    }
}
