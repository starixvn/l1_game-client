import BetItem from "../../../_base/BetItem";
import * as helper from "../../../../common/helpers/Helper.js";

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

    public showWinningText() {
        // this.choice.color = this.highlightColor;
    }

    public hideWinningText() {
        // this.choice.color = this.normalColor;
    }

    public showWinningEffect() {
        this.winningEffectNode.active = true;
    }

    public hideWinningEffect() {
        this.winningEffectNode.active = false;
    }

    public inputBetChanged(bet: number) {
        this.inputBet.string = helper.numberWithCommas(bet);
        this.inputBet.node.parent.active = true;
    }

    public clearInputBet() {
        this.inputBet.node.parent.active = false;
    }
}
