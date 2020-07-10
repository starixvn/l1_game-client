import * as helper from '../../../common/helpers/Helper';
import BetItem from '../../_base/BetItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedieBetItem extends BetItem {

    public setHighlight(highlight: boolean, isAnimated = true) {
        super.setHighlight(highlight, isAnimated);

        this.highlightBorder && (this.highlightBorder.active = highlight && !isAnimated);
    }

    public resetHighlight() {
        this.highlight.active = false;
    }
}
