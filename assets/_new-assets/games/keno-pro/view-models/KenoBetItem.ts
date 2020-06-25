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
        this.totalBet.string = bet > 0 ? helper.numberWithCommas(bet) : '';
    }

    public setHighlight(highlight: boolean, isAnimated = true) {
        super.setHighlight(highlight, isAnimated);
        this.inActive.active = !highlight && isAnimated;
    }

    public resetHighlight() {
        this.inActive.active = false;
        this.highlight.active = false;
    }
}
