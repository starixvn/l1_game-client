import EffectAppearanceLabel from "../../../common/EffectAppearanceLabel";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LightEffect extends EffectAppearanceLabel {
    @property(cc.Node)
    guide: cc.Node = null;

    protected calculateDistance(): number {
        const width = this.guide ? this.guide.width : 0;
        const padding = 20;
        return width + padding;
    }
}
