import * as helper from '../../../../_new-assets/common/helpers/Helper';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoPresetBet extends cc.Component {

    @property(cc.Label)
    betValue: cc.Label = null;

    @property(cc.Button)
    betButton: cc.Button = null;

    private betAmount = 0;
    private callback = (betAmount: number) => { };

    public clearBet() {
        this.betAmount = 0;
        this.updateBetAmount();
    }

    public onClose() {
        cc.RedT.audio.playClick();
        this.close();
    }

    public close() {
        this.node.active = false;
        this.callback(0);
    }

    public onAcceptBet() {
        this.node.active = false;
        this.callback(this.betAmount);
    }

    public onItemBetClicked(e, index) {
        const amounts = [1, 10, 50, 100, 500];
        const amount = amounts[index];

        this.betAmount = this.betAmount + amount;
        this.updateBetAmount();
    }

    private updateBetAmount() {
        this.betValue.string = this.betAmount > 0 ? helper.numberWithCommas(this.betAmount) : "";

        const canBet = this.betAmount >= 1;
        this.betButton.interactable = canBet;
        this.betButton.node.opacity = canBet ? 255 : 102;
    }
}
