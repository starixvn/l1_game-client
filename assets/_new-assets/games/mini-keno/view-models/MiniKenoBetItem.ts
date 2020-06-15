import BetItem from "../../_base/BetItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoBetItem extends BetItem {

    protected setOwnBet(bet: number) {
        super.setOwnBet(bet);
        this.ownBet.node.parent.active = bet > 0;
    }
}
