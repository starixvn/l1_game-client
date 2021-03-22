const { ccclass, property } = cc._decorator;

@ccclass
export default class CustomePageViewIndicator extends cc.PageViewIndicator {
    _changedState() {
        const indicators = this._indicators;
        if (indicators.length === 0) return;
        const idx = this._pageView._curPageIdx;
        if (idx >= indicators.length) return;
        for (let i = 0; i < indicators.length; ++i) {
            const node = indicators[i];
            node.opacity = 0;
        }
        indicators[idx].opacity = 255;
    }
}
