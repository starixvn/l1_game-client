import _ = require("lodash");

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplierItem extends cc.Component {
    @property(cc.Sprite)
    center: cc.Sprite = null;

    @property(cc.Sprite)
    centerGlow: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Label)
    value: cc.Label = null;

    @property(cc.Animation)
    animation: cc.Animation = null;

    private _multiplierValue = 1;

    get multiplier() {
        return this._multiplierValue;
    }

    hideMultiplier() {
        this.value.node.active = false;
        this.animation.stop();
    }

    playAnimationGlow() {
        return new Promise<void>((resolve) => {
            this.animation.play();
            const duration = this.animation.defaultClip.duration;
            this.scheduleOnce(() => {
                this.hideMultiplier();
                resolve();
            }, duration);
        });
    }

    setRandomValue() {
        const arr = [2, 3, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25];
        const value = arr[_.random(0, arr.length - 1)];
        this.setValue(value);
    }

    setValue(value: number) {
        this._multiplierValue = value;
        this.value.string = `x${value}`;
        this.updateColor(value);
    }

    updateColor(value: number) {
        const color = ["green", "blue", "purple", "yellow"];
        let i = 0;
        const range = [10, 20, 30];
        for (; i < range.length; i++) {
            if (value <= range[i]) {
                break;
            }
        }
        const spriteName = `multiplier-${color[i]}`;
        this.center.spriteFrame = this.atlas.getSpriteFrame(spriteName);
        this.centerGlow.spriteFrame = this.atlas.getSpriteFrame(`${spriteName}-glow`);
    }
}
