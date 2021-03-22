const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryTypeItem extends cc.Component {
    @property(cc.Label)
    odds: cc.Label = null;

    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    onLoad() {
        this.odds.node.active = false;
    }

    setOdds(value: string) {
        this.odds.node.active = true;
        this.odds.string = `1:${value}`;
    }
}
