import BetItem from "../../../_base/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoBetItem extends BetItem {
    @property(cc.Node)
    choice: cc.Node = null;

    @property(cc.Label)
    rule: cc.Label = null;

    @property(cc.Prefab)
    winningPrefab: cc.Prefab = null;

    @property(cc.Node)
    winningEffectNode: cc.Node = null;

    private readonly highlightColor = new cc.Color(249, 191, 4);

    private readonly normalColor = new cc.Color(0, 40, 107);

    onLoad() {
        this.winningEffectNode.addChild(cc.instantiate(this.winningPrefab));
        this.winningEffectNode.active = false;
    }

    protected setOwnBet(bet: number) {
        super.setOwnBet(bet);
        this.ownBet.node.parent.active = bet > 0;
    }

    public setHighlight(highlight: boolean, isAnimated = true) {
        super.setHighlight(highlight, isAnimated);
        this.choice.color = highlight && !isAnimated ? this.highlightColor : this.normalColor;
    }

    public resetHighlight() {
        super.resetHighlight();
        this.winningEffectNode.active = false;
    }

    public showWinningEffect() {
        this.winningEffectNode.active = true;
    }

    public setRule(value: string) {
        this.rule.string = value;
    }
}
