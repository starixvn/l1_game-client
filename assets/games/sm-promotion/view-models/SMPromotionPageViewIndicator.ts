import { SpriteFrame } from "../../../../creator";
const { ccclass, property } = cc._decorator;

@ccclass
export default class SMPromotionPageViewIndicator extends cc.PageViewIndicator {
    @property(cc.SpriteFrame)
    activeFrame: cc.SpriteFrame = null;

    _changedState() {
        const indicators = this._indicators;
        if (indicators.length === 0) {
            return;
        }
        const idx = this._pageView._curPageIdx;
        if (idx >= indicators.length) {
            return;
        }
        indicators.forEach((node) => (node.getComponent(cc.Sprite).spriteFrame = this.spriteFrame));
        indicators[idx].getComponent(cc.Sprite).spriteFrame = this.activeFrame;
    }
}
