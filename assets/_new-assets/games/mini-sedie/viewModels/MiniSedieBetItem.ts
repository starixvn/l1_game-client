import * as helper from '../../../common/helpers/Helper';
import BetItem from '../../_base/BetItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedieBetItem extends BetItem {

    @property(cc.Node)
    inActive: cc.Node = null;

    public setHighlight(highlight: boolean) {
        this.inActive.active = !highlight;
        this.highlight.active = highlight;
    }

    public resetHighlight() {
        this.inActive.active = false;
        this.highlight.active = false;
    }
}
