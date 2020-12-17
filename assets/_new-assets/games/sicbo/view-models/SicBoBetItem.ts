import { numberWithCommas } from '../../../common/helpers/Helper.js';
import BetItem from '../../_base/BetItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoBetItem extends BetItem {
    protected setTotalBet(bet: number) {
        this.totalBet && (this.totalBet.string = bet > 0 ? numberWithCommas(bet, 1) : "");
    }

    protected setHighlightItems(highlight: boolean, isAnimated = true) {
        super.setHighlightItems(highlight, isAnimated);
        this.highlightBorder && (this.highlightBorder.active = highlight && !isAnimated);
    }
}