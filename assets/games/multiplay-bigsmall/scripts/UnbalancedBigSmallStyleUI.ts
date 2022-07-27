const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmallStyleUI extends cc.Component {
    @property(cc.Sprite)
    gameName: cc.Sprite = null;

    @property(cc.Sprite)
    tableGameBg: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    mainAtlas: cc.SpriteAtlas = null;

    renderTableGame(gameId: number) {
        this.gameName.spriteFrame = this.mainAtlas.getSpriteFrame(`tablename-${gameId}`);
        this.tableGameBg.spriteFrame = this.mainAtlas.getSpriteFrame(`table${gameId}`);
    }
}
