const { ccclass, property, menu, executeInEditMode } = cc._decorator;
const pathRoot = "image";

@ccclass
@executeInEditMode
@menu("i18n/LocalizedLoadSprite")
export default class LocalizedLoadSprite extends cc.Component {
    @property()
    gameId = 0;

    @property()
    nameImage = "";

    protected sprite: cc.Sprite;

    onLoad() {
        this.fetchRender();
    }

    public fetchRender() {
        const sprite = this.getComponent(cc.Sprite);
        if (sprite) {
            this.sprite = sprite;
            this.updateSprite({ language: window.i18n.curLang, name: this.nameImage, gameId: this.gameId });
            return;
        }
    }

    public getSpriteFrameByLang(lang: string, name: string, gameId: number) {
        return new Promise<cc.SpriteFrame>((resolve) => {
            cc.resources.load<cc.SpriteFrame>(`${pathRoot}/${lang}/${gameId}/${name}`, cc.SpriteFrame, (err, spriteFrame) => {
                resolve(spriteFrame);
            });
        });
    }

    async updateSprite({ language, name, gameId }) {
        if (!this.sprite) {
            if (this.node.activeInHierarchy) {
                cc.error("Failed to update localized sprite, sprite component is invalid!");
            }
            return;
        }

        const spriteFrame = await this.getSpriteFrameByLang(language, name, gameId);
        this.sprite.spriteFrame = spriteFrame;
    }
}
