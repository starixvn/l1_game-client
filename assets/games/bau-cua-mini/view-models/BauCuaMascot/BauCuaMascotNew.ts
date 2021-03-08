import { numberWithCommas } from "../../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BauCuaMascotNew extends cc.Component {
    @property(cc.Sprite)
    xSprite: cc.Sprite = null;

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Label)
    me: cc.Label = null;

    @property(cc.SpriteFrame)
    x2Sprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    x3Sprite: cc.SpriteFrame = null;

    lastTotalCuoc = 0;

    meCuoc(cuoc) {
        if (!!cuoc) {
            this.me.string = numberWithCommas(cuoc);
        }
    }
    totallCuoc(cuoc) {
        this.total.string = cuoc > 0 ? numberWithCommas(cuoc) : "";
    }
    Select(x) {
        this.xSprite.node.active = x !== 1;
        this.xSprite.spriteFrame = x === 2 ? this.x2Sprite : this.x3Sprite;
    }
    unSelect() {
        this.xSprite.node.active = false;
    }
    clearCuoc() {
        this.lastTotalCuoc = 0;
        this.total.string = "";
        this.me.string = "";
    }
    updateState(show) {
        this.node.children[1].active = show;
        this.node.children[2].active = show;
    }
    resetState() {
        this.node.children[1].active = false; // highlight
        this.node.children[2].active = true;
    }
}
