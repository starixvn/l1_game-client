import BetItem from "../../_base/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoBetItem extends BetItem {
    @property(cc.Node)
    choice: cc.Node = null;

    @property(cc.Label)
    rule: cc.Label = null;

    protected setOwnBet(bet: number) {
        super.setOwnBet(bet);
        this.ownBet.node.parent.active = bet > 0;
    }

    public setHighlight(highlight: boolean, isAnimated = true) {
        super.setHighlight(highlight, isAnimated);
        this.choice.color = highlight ? new cc.Color(249, 191, 4) : new cc.Color(0, 40, 107);
    }

    public setRule(value: string) {
        this.rule.string = value;
    }
}
