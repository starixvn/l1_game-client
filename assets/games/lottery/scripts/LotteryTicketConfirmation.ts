import BetBoard from "../../../common/bet-board/view-models/BetBoard";
import LotteryHelper from "./LotteryHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import ItemLayout from "./ItemLayout";
import { ChoiceType } from "./Lottery";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";

export interface LotteryTicketInfo {
    choiceType: number;
    roundId: string;
    odds: string;
    maxBet: number;
    bet: number;
    selectedItems: string;
    ownBets: any;
    maxBetTotal: number;
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryTicketConfirmation extends BetBoard {
    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    odds: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    inputBet: cc.Label = null;

    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(cc.Label)
    limitBet: cc.Label = null;

    @property(ItemLayout)
    itemLayout: ItemLayout = null;

    @property(cc.Node)
    noticeContainer: cc.Node = null;

    @property(cc.Prefab)
    noticePrefab: cc.Prefab = null;

    isClosed = false;
    protected commonDialog: CommonDialog;
    onLoad() {
        super.onLoad();
        this.commonDialog = this.node.getComponent(CommonDialog);
        this.commonDialog.onDidHide = () => this.node.destroy();
    }

    protected checkBetLimit(): boolean {
        if (this.isReachMaxBetPerChoice()) {
            return false;
        }
        const totalInputBet = this.getCurrentTotal();
        const totalBet = this.info.ownBets.totalAmount;
        if (totalInputBet + totalBet > this.info.maxBetTotal) {
            this.showNotice(`Tổng tiền cược tối đa của phiên này là ${numberWithCommas(this.info.maxBetTotal)}.`);
            return false;
        }
        return true;
    }

    isReachMaxBetPerChoice(): boolean {
        const choiceKey = LotteryHelper.getChoiceTypeKey(this.info.choiceType);

        const isMaxBetPerNumber =
            this.info.choiceType === ChoiceType.Set4 ||
            this.info.choiceType === ChoiceType.Special ||
            this.info.choiceType === ChoiceType.Head ||
            this.info.choiceType === ChoiceType.Tail ||
            this.info.choiceType === ChoiceType.Set27;

        if (!isMaxBetPerNumber) {
            const totalInputBet = this.getCurrentTotal();
            const totalPerChoice = this.info.ownBets[choiceKey];
            if (totalInputBet > this.info.maxBet || totalInputBet + totalPerChoice > this.info.maxBet) {
                this.showNotice("Tiền cược vượt mức quy định.");
                return true;
            }
        } else {
            const inputBet = this.info.bet;
            const choices = this.info.selectedItems;
            const notValidList = [];
            choices.forEach((choice) => {
                const choiceTotal = (this.info.ownBets[choiceKey] && this.info.ownBets[choiceKey][choice]) || 0;
                if (+inputBet + +choiceTotal > +this.info.maxBet) {
                    notValidList.push(choice);
                }
            });
            if (notValidList.length > 0) {
                this.showNotice(`Tiền cược trên số [${notValidList.join(", ")}] vượt mức quy định.`);
                return true;
            }
        }
    }

    protected getMaxTotalBetOfChoices(choices: string[], choiceKey: string) {
        let total = 0;
        choices.forEach((choice) => {
            const choiceTotal = (this.info.ownBets[choiceKey] && this.info.ownBets[choiceKey][choice]) || 0;
            total = Math.max(total, choiceTotal);
        });
        return total;
    }

    showNotice(text: string) {
        const notice = cc.instantiate(this.noticePrefab);
        const noticeComponent = notice.getComponent("mini_warning");
        noticeComponent.text.string = text;
        this.noticeContainer.addChild(notice);
    }

    protected closeBoard() {
        this.isClosed = true;
        this.commonDialog.closeDialog();
        this.info = null;
    }

    public show(info: any) {
        this.info = info;
        this.info.bet = info.bet || this.callback.getPreset();
        this.info.bet = Math.min(this.info.bet, this.info.maxBet);
        this.node.active = true;
        this.updateDisplay();
        this.betChanged();
    }

    updateDisplay() {
        this.choice.string = LotteryHelper.getNameChoiceType(this.info.choiceType);
        this.odds.string = `1:${this.info.odds}`;
        this.roundId.string = `#${this.info.roundId}`;
        this.limitBet.string = `1 - ${this.info.maxBet}`;
        this.itemLayout.updateItems(this.info.selectedItems, this.info.choiceType !== ChoiceType.Others, null);
    }

    protected betChanged() {
        super.betChanged();
        this.inputBet.string = numberWithCommas(this.info.bet);
        this.updateTotalBet();
    }

    updateTotalBet() {
        const total = this.getCurrentTotal();
        this.totalBet.string = numberWithCommas(total);
    }

    getCurrentTotal(): number {
        const isParlay =
            this.info.choiceType === ChoiceType.Parlay2 ||
            this.info.choiceType === ChoiceType.Parlay3 ||
            this.info.choiceType === ChoiceType.Parlay4;
        return isParlay ? this.info.bet : this.info.bet * this.info.selectedItems.length;
    }
}
