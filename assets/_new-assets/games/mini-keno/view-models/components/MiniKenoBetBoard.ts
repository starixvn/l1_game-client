import * as helper from '../../../../../_new-assets/common/helpers/Helper';

const { ccclass, property } = cc._decorator;

export interface BetInfo {
    title: string;
    odd: number;
    choice: string;
    minBet: number;
    maxBet: number;
}

@ccclass
export default class MiniKenoBetBoard extends cc.Component {

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    winBet: cc.Label = null;

    @property(cc.Label)
    minBet: cc.Label = null;

    @property(cc.Label)
    maxBet: cc.Label = null;

    @property(cc.Label)
    betValue: cc.Label = null;

    @property(cc.Button)
    betButton: cc.Button = null;

    private betAmount = 0;
    private callback = (betAmount: number) => { };
    private info: BetInfo;

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

    public show(info: BetInfo, callback: (betAmount: number) => void) {
        this.info = info;
        this.node.active = true;

        this.betAmount = 0;
        this.updateBetAmount();
        this.title.string = this.info.title;
        this.choice.string = `${this.info.choice} @${this.info.odd}`;
        this.minBet.string = helper.numberWithCommas(this.info.minBet);
        this.maxBet.string = helper.numberWithCommas(this.info.maxBet);
        this.callback = callback;
    }

    public rebet(title: string) {
        this.title.string = title;
        this.node.active = true;
    }

    public onItemBetClicked(e, index) {
        const amounts = [1, 10, 50, 100, 500, this.info.maxBet];
        const amount = amounts[index];
        if (amount == this.info.maxBet) {
            this.betAmount = amount;
            this.updateBetAmount();
            return;
        }

        if (!this.isValidBet(this.betAmount + amount)) {
            //show warning
            return;
        }

        this.betAmount = this.betAmount + amount;
        this.updateBetAmount();
    }

    private updateBetAmount() {
        this.betValue.string = this.betAmount > 0 ? helper.numberWithCommas(this.betAmount) : "";
        const winAmount = (this.betAmount * this.info.odd);
        this.winBet.string = winAmount > 0 ? helper.numberWithCommas(winAmount) : "";

        const canBet = this.betAmount >= this.info.minBet;
        this.betButton.interactable = canBet;
        this.betButton.node.opacity = canBet ? 255 : 102;
    }

    private isValidBet(betAmount: number): boolean {
        return betAmount <= this.info.maxBet && betAmount >= this.info.minBet;
    }
}
