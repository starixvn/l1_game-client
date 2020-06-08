const { ccclass, property } = cc._decorator;
import ChanLeMain from './../main/ChanLeMain';

@ccclass
export default class ChanLeBetBoard extends cc.Component {
    @property(cc.Node)
    okButton: cc.Node = null;

    private main: ChanLeMain;

    init(main: ChanLeMain) {
        this.main = main;
    }

    onEnable() {
        const okButtonPositionY = this.okButton.parent.convertToWorldSpaceAR(this.okButton.position).y;
        const expectPositionY = this.okButton.height;
        const paddingBottom = 20;

        if (okButtonPositionY < expectPositionY) {
            const distance = expectPositionY - okButtonPositionY + paddingBottom;

            this.main.node.runAction(
                cc.moveBy(0.5, cc.v2(0, distance)).easing(cc.easeBackOut()));
        }
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
