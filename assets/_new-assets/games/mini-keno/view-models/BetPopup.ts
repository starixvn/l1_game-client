const { ccclass, property } = cc._decorator;

export interface BetInfo {
    title: string;
    odd: string;
    choice: string;
    minBet: number;
    maxBet: number;
}

@ccclass
export default class BetPopup extends cc.Component {

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    limitBet: cc.Label = null;

    @property(cc.Label)
    betValue: cc.Label = null;

    private betAmount = 0;
    private callback = (betAmount: number) => { };
    private info: BetInfo;

    public clearBet() {
        this.betAmount = 0;
        this.updateBetAmount();
    }

    public onClose() {
        cc.RedT.audio.playClick();
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
        this.choice.string = `${this.info.choice} - 1:${this.info.odd}`;
        this.limitBet.string = `${this.info.minBet} - ${this.info.maxBet}`;
        this.callback = callback;
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
        this.betValue.string = this.betAmount > 0 ? `${this.betAmount}` : "";
    }

    private isValidBet(betAmount: number): boolean {
        return betAmount <= this.info.maxBet && betAmount >= this.info.minBet;
    }
}
