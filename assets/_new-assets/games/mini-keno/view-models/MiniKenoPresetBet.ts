import * as helper from '../../../../_new-assets/common/helpers/Helper';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoPresetBet extends cc.Component {

    @property(cc.Label)
    betValue: cc.Label = null;

    @property(cc.Button)
    betButton: cc.Button = null;

    private betAmount = 0;
    public onChangedBet = (betAmount: number) => { };
    public getPreset = () => { return 0 };

    onEnable() {
        this.betAmount = this.getPreset();
        this.updateBetAmount();
    }

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
    }

    public onResetBet() {
        this.node.active = false;
        this.clearBet();
        this.onChangedBet(this.betAmount);
    }

    public onAcceptBet() {
        this.node.active = false;
        this.onChangedBet(this.betAmount);
    }

    public onItemBetClicked(e, index) {
        const amounts = [1, 10, 50, 100, 500, 1000];
        const amount = amounts[index];
        this.betAmount = this.betAmount + amount;
        this.updateBetAmount();
    }

    public show(show: boolean = true) {
        this.node.active = show;
    }

    private updateBetAmount() {
        this.betValue.string = helper.numberWithCommas(this.betAmount);
    }
}
