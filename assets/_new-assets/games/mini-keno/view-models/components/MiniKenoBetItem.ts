import { numberWithCommas } from "../../../../common/helpers/NumberHelper.js";
import BetItem from "../../../_base/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoBetItem extends BetItem {
    @property(cc.Label)
    inputBet: cc.Label = null;

    @property(cc.Prefab)
    winningPrefab: cc.Prefab = null;

    @property(cc.Node)
    winningEffectNode: cc.Node = null;

    private readonly highlightColor = new cc.Color(249, 191, 4);

    private readonly normalColor = new cc.Color(0, 40, 107);

    onLoad() {
        this.winningEffectNode.addChild(cc.instantiate(this.winningPrefab));
        this.winningEffectNode.active = false;

        this.inputBet.string = "";
        this.inputBet.node.parent.active = false;
    }

    protected setOwnBet(bet: number) {
        super.setOwnBet(bet);
        this.ownBet.node.active = bet > 0;
    }

    public showWinningEffect() {
        this.winningEffectNode.active = true;
    }

    public hideWinningEffect() {
        this.winningEffectNode.active = false;
    }

    public inputBetChanged(bet: number) {
        this.inputBet.string = numberWithCommas(bet);
        this.inputBet.node.parent.active = true;
        this.inputBet.node.stopAllActions();
        this.inputBet.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.5), cc.scaleTo(0.2, 1).easing(cc.easeBackOut())));
    }

    public clearInputBet() {
        this.inputBet.node.parent.active = false;
    }

    public resetHighlight() {
        super.resetHighlight();

        this.hideWinningEffect();
    }
}
