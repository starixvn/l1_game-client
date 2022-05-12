const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTumbleItem extends cc.Component {
    @property(cc.Label)
    numberIcon: cc.Label = null;

    @property(cc.Sprite)
    symbol: cc.Sprite = null;

    @property(cc.Label)
    winningValue: cc.Label = null;

    @property(cc.SpriteAtlas)
    mainAtlas: cc.SpriteAtlas = null;

    onLoad() {}

    setData(icon: number, count: number, win: number) {
        this.numberIcon.string = count.toString();
        this.winningValue.string = win.toString();
        this.symbol.spriteFrame = this.mainAtlas.getSpriteFrame("symbol_" + icon);
        this.symbol.node.scale = 0.2;
    }
}
