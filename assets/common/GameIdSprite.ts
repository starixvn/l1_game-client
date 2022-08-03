const { ccclass, property } = cc._decorator;

@ccclass
export default class GameIdSprite extends cc.Component {
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property
    prefix = "";

    sprite: cc.Sprite;
    _gameId: number;
    set gameId(value: number) {
        this._gameId = value;
        this.updateSprite();
    }

    onLoad() {
        this.sprite = this.node.getComponent(cc.Sprite);
    }

    updateSprite() {
        this.sprite.spriteFrame = this.atlas.getSpriteFrame(`${this.prefix}${this._gameId}`);
    }
}
