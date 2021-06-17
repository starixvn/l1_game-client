const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class OnePackLocalizedSprite extends cc.Component {
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property()
    prefix = "";

    protected sprite: cc.Sprite;

    onLoad() {
        this.fetchRender();
    }

    fetchRender() {
        let sprite = this.getComponent(cc.Sprite);
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite(window.i18n.curLang);
            return;
        }
    }

    getSpriteFrameByLang(lang: string) {
        const spriteName = `${this.prefix}_${lang}`;
        return this.atlas.getSpriteFrame(spriteName);
    }

    getDefaultSprite() {
        return this.atlas.getSpriteFrame(this.prefix);
    }

    updateSprite(language) {
        if (!this.sprite) {
            cc.error("Failed to update localized sprite, sprite component is invalid!");
            return;
        }

        let spriteFrame = this.getSpriteFrameByLang(language);
        if (!spriteFrame) {
            spriteFrame = this.getDefaultSprite();
        }

        this.sprite.spriteFrame = spriteFrame;
    }
}
