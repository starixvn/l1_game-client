import BetBoard from "../../../common/bet-board/view-models/BetBoard";
import LotteryHelper from "./LotteryHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import ItemLayout from "./ItemLayout";
import { ChoiceType } from "./Lottery";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import GameUtils from "../../../common/GameUtils";

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

    @property(CommonDialog)
    protected commonDialog: CommonDialog = null;

    isClosed = false;

    onLoad() {
        super.onLoad();
        this.commonDialog.onDidHide = () => this.node.destroy();
    }

    protected checkBetLimit(): boolean {
        if (this.isReachMaxBetPerChoice()) {
            return false;
        }
        const totalInputBet = this.getCurrentTotal();
        const totalBet = this.info.ownBets.totalAmount || 0;
        if (totalInputBet + totalBet > this.info.maxBetTotal) {
            this.showNotice(`Tổng tiền cược tối đa của phiên này là ${numberWithCommas(this.info.maxBetTotal)}.`);
            return false;
        }
        if (totalInputBet > cc.RedT.user.red) {
            this.showNotice("Bạn hiện không có đủ tiền để cược.");
            return false;
        }
        return true;
    }

    isReachMaxBetPerChoice(): boolean {
        const choiceKey = LotteryHelper.getChoiceTypeKey(this.info.choiceType);
        let choices = [...this.info.selectedItems].sort((a, b) => parseInt(b) - parseInt(a));
        if (choiceKey.slice(0, 6) === "parlay") {
            choices = [choices.join("-")];
        }
        const inputBet = this.info.bet;
        const isOthers = this.info.choiceType === ChoiceType.Others;

        const notValidList = [];
        choices.forEach((choice) => {
            const choiceTotal = (this.info.ownBets[choiceKey] && this.info.ownBets[choiceKey][choice]) || 0;
            if (+inputBet + +choiceTotal > +this.info.maxBet) {
                if (isOthers) {
                    notValidList.push(GameUtils.getBetChoiceString(choice));
                } else {
                    notValidList.push(choice);
                }
            }
        });
        if (notValidList.length > 0) {
            this.showNotice(`Tiền cược trên [${notValidList.join(", ")}] vượt mức quy định.`);
            return true;
        }
        return false;
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
