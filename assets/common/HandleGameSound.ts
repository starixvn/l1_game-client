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
        this.initSound();
    }

    onDestroy() {
        this.node.off("click", this.onClickSoundGame, this);
    }

    private getKey(): string {
        const dict = ["musicEnabled", "sfxEnabled"];
        return dict[this.type];
    }

    initSound() {
        AudioManager.getInstance()[this.getKey()] ? this.setSoundGameOn() : this.setSoundGameOff();
        // AudioManager.getInstance()[this.getKey()] ? this.setsSpriteFrame(true) : this.setsSpriteFrame(false);
    }

    onClickSoundGame() {
        AudioManager.getInstance()[this.getKey()] ? this.setSoundGameOff() : this.setSoundGameOn();
        // this.setsSpriteFrame(AudioManager.getInstance()[this.getKey()]);
    }

    setSoundGameOn() {
        this.soundSprite.spriteFrame = this.soundOnFrame;
        AudioManager.getInstance()[this.getKey()] = true;
    }

    setSoundGameOff() {
        this.soundSprite.spriteFrame = this.soundOffFrame;
        AudioManager.getInstance()[this.getKey()] = false;
    }

    // setsSpriteFrame(isSoundOn: boolean) {
    //     if (isSoundOn) {
    //         this.soundSprite.spriteFrame = this.soundOnFrame;
    //     } else {
    //     }
    // }
}
