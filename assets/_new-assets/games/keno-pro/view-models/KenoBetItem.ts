import * as helper from '../../../common/helpers/Helper';
import BetItem from '../../_base/BetItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoBetItem extends BetItem {

    @property(cc.Node)
    inActive: cc.Node = null;

    protected setOwnBet(bet: number) {
        this.ownBet.string = bet > 0 ? helper.numberWithCommas(bet) : "";
    }

    protected setTotalBet(bet: number) {
        //this.totalBet.string = bet > 0 ? helper.numberWithCommas(bet) : "";

        if (bet > 0) {
            helper.numberTo(this.totalBet, 0, bet, 0, true);
        } else {
            this.totalBet.string = ""
        }
    }

    public setHighlight(highlight: boolean) {
        this.inActive.active = !highlight;
        this.highlight.active = highlight;
        this.highlightBorder.active = highlight;
    }

    public resetHighlight() {
        this.inActive.active = false;
        this.highlight.active = false;
    }
}
