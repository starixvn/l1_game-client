import * as helper from '../../../common/helpers/Helper';
import BetItem from '../../_base/BetItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoBetItem extends BetItem {

    @property(cc.Node)
    inActive: cc.Node = null;

    @property(cc.Node)
    highlight: cc.Node = null;

    protected setOwnBet(bet: number) {
        this.ownBet.string = bet > 0 ? helper.numberWithCommas(bet) : "";
    }

    protected setTotalBet(bet: number) {
        this.totalBet.string = bet > 0 ? helper.numberWithCommas(bet) : "";
        this.totalBet.node.parent.active = bet > 0;
    }

    public setHighlight(highlight: boolean) {
        this.inActive.active = !highlight;
        this.highlight.active = highlight;
    }

    public resetHighlight() {
        this.inActive.active = false;
        this.highlight.active = false;
    }
}
