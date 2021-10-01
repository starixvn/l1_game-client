import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import BetItem from "../../../_base/view-models/BetItem";

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

    public setOwnBet(bet: number) {
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
        cc.tween(this.inputBet.node).to(0.1, { scale: 1.5 }).to(0.2, { scale: 1 }, { easing: "backOut" }).start();
    }

    public clearInputBet() {
        this.inputBet.node.parent.active = false;
    }

    public resetHighlight() {
        super.resetHighlight();

        this.hideWinningEffect();
    }
}
