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

    setData(icon: number, count: number, win: number) {
        this.numberIcon.string = count.toString();
        this.winningValue.string = win.toString();
        this.symbol.spriteFrame = this.mainAtlas.getSpriteFrame("symbol_" + (icon + 1));
    }

    setDataForFreeSpinTumble(count: number, win: number, freeSpin: boolean) {
        this.numberIcon.string = count.toString();
        //TODO: missing localized
        this.winningValue.string = win.toString() + (freeSpin ? " Extra FreeSpin" : " FreeSpin");
        this.symbol.spriteFrame = this.mainAtlas.getSpriteFrame("symbol_10");
    }
}
