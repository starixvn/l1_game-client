const { ccclass, property } = cc._decorator;
import { getOnlyNumberInString, numberWithCommas } from '../../../../common/helpers/Helper';
import ChanLeMain from './../main/ChanLeMain';

@ccclass
export default class ChanLeBetBoard extends cc.Component {
    private main: ChanLeMain;

    init(main: ChanLeMain) {
        this.main = main;
    }

    onSelectBetMoney(event, value) {
        this.main.setCurrentBetInput(value);
    }

    onCloseClick() {
        this.node.active = false;
        // this.RedT.input.string = "ĐẶT CƯỢC";
        // this.RedT.setBetButtonClicked(false);
    }
}
