import RouletteUtils from "./RouletteUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteResultNumber extends cc.Component {
    @property(cc.Sprite)
    background: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    backgroundAtlas: cc.SpriteAtlas = null;

    @property(cc.Label)
    label: cc.Label = null;

    setNumber(number: number) {
        this.label.string = number.toString();
        const type = number == 0 ? 'green' : (RouletteUtils.isRed(number) ? 'red' : 'black');
        this.background.spriteFrame = this.backgroundAtlas.getSpriteFrame(`history_number_${type}`);
        this.show();
    }

    show() {
        this.node.active = true;
    }

    hide() {
        this.node.active = false;
    }
}
