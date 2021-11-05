const SpriteFrameSet = require("SpriteFrameSet");
const LocalizedSprite = require("LocalizedSprite");

const { ccclass, property, executeInEditMode, menu } = cc._decorator;
const pathRoot = "image";

@ccclass
@executeInEditMode
@menu("i18n/OnePackLocalizedSprite")
export default class LocalizedLoadSprite extends LocalizedSprite {
    @property()
    nameImage = "";

    @property({ type: SpriteFrameSet, visible: false, override: true })
    spriteFrameSet: SpriteFrameSet[] = [];

    protected sprite: cc.Sprite;

    onLoad() {
        this.fetchRender();
    }

    fetchRender() {
        const sprite = this.getComponent(cc.Sprite);
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite(window.i18n.curLang, this.nameImage);
            return;
        }
    }

    getSpriteFrameByLang(lang: string, name: string) {
        console.log(`${pathRoot}/${lang}/${name}`);
        return new Promise<cc.SpriteFrame>((resolve) => {
            cc.resources.load<cc.SpriteFrame>(`${pathRoot}/${lang}/${name}`, cc.SpriteFrame, (err, spriteFrame) => {
                resolve(spriteFrame);
            });
        });
    }

    async updateSprite(language, name) {
        if (!this.sprite) {
            if (this.node.activeInHierarchy) {
                cc.error("Failed to update localized sprite, sprite component is invalid!");
            }
            return;
        }

        const spriteFrame = await this.getSpriteFrameByLang(language, name);
        this.sprite.spriteFrame = spriteFrame;
    }
}
