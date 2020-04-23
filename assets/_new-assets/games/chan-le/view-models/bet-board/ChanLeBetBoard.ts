const { ccclass, property } = cc._decorator;
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
        this.main.resetCurrentBetInput();
        this.main.setBetButtonFrame(false);
    }
}
