import * as helper from "../../../common/helpers/Helper";
import { CardModel } from "../../../common/new-card/view-models/NewCard";
import BlackJackUtils from "./BlackJackUtils";
import CardLayout from "./CardLayout";

export interface HandModel {
    id: string,
    pos: number,
    bet: number,
    total: any,
    isStand: boolean,
    cards: any[],
    splitFrom: boolean,
    actions: string[],
}

const { ccclass, property, executeInEditMode } = cc._decorator;
@ccclass
@executeInEditMode
export default class HandPlace extends cc.Component {
    @property(cc.Button)
    betPlace: cc.Button = null;

    @property(CardLayout)
    cardLayout: CardLayout = null;

    @property(cc.Node)
    clearBetButton: cc.Node = null;

    @property(cc.Label)
    betValue: cc.Label = null;

    @property(cc.Label)
    scoreValue: cc.Label = null;

    @property(cc.Label)
    resultValue: cc.Label = null;

    @property(cc.Label)
    handId: cc.Label = null;

    @property(cc.Node)
    blackJackNode: cc.Node = null;

    @property(cc.Node)
    burstNode: cc.Node = null;

    @property(cc.Node)
    errorNode: cc.Node = null;

    @property(cc.Node)
    betText: cc.Node = null;

    @property
    _selected = false;

    @property
    get selected() {
        return this._selected;
    }

    set selected(value) {
        this._selected = value;
        this.updateDisplay();
    }

    private data: HandModel = null;

    get isStand() {
        return this.data.isStand;
    }

    get canSplit() {
        const cards = this.data.cards;
        if (cards.length != 2) {
            return false;
        }

        const firstValues = BlackJackUtils.getValues(cards[0].rank);
        const secondValues = BlackJackUtils.getValues(cards[1].rank);
        let isEqual = false;
        for (let value of firstValues) {
            if (secondValues.includes(value)) {
                isEqual = true;
                break;
            }
        }

        return isEqual && !this.isSplit;
    }

    get isSplit() {
        return this.data.splitFrom || this.data.actions.includes("split");
    }

    get canDouble() {
        const cards = this.data.cards;
        if (cards.length != 2) {
            return false;
        }

        const total = this.data.total[0];
        return total > 8 && total < 12 && !this.isSplit;
    }

    get isActive() {
        return this.data != null;
    }

    get idValue() {
        return this.data.id;
    }

    private _betAmount = 0;
    public betItemClickCallback = () => { }
    public clearBetClickCallback = () => { }

    onLoad() {
        this.resetView();
    }

    resetView() {
        if (this.clearBetButton) {
            this.clearBetButton.on('click', this.onClearBetClick, this);
            this.clearBetButton.active = false;
        }

        this.showBetValue(false);
        this.showScore(false);
        this.handId && this.showHandId(false);
        this.resultValue && this.showResult(false);
        this.blackJackNode.active = false;
        this.burstNode.active = false;
        this.errorNode && (this.errorNode.active = false);
        this.betText && (this.betText.active = true);
    }

    updateDisplay() {
        this.cardLayout.shadow.active = this.selected;
        this.cardLayout.changeCardView(this.selected);
    }

    setData(data: HandModel) {
        this.data = { ...data };
        this.setHandId(this.data.id);
    }

    clearData() {
        this.data = null;
    }

    onBetItemClick() {
        this.betItemClickCallback();
    }

    onClearBetClick() {
        this.resetView();
        this.clearBetAmount();
        this.clearData();
        this.clearBetClickCallback();
    }

    getBetAmount(): number {
        return this._betAmount;
    }

    addBetAmount(amount: number) {
        this._betAmount += amount;
        this.updateDisplayBetValue(this._betAmount);
    }

    clearBetAmount() {
        this._betAmount = 0;
    }

    addCard(card: cc.Node) {
        this.cardLayout.content.addChild(card, 1000); //make sure higher zIndex
    }

    getCards(): cc.Node[] {
        return this.cardLayout.content.children;
    }

    showBetValue(show: boolean) {
        this.betValue && (this.betValue.node.parent.active = show);
    }

    updateDisplayBetValue(bet?: number) {
        this.showBetValue(true);
        this.betValue.string = helper.numberWithCommas(bet ? bet : this._betAmount);
    }

    syncBetValue() {
        this.updateDisplayBetValue(this.data.bet);
        this._betAmount = this.data.bet;
    }

    showScore(show: boolean) {
        this.scoreValue.node.parent.active = show;
    }

    updateDisplayScore(final: boolean) {
        if (!this.data) {
            this.scoreValue.string = "";
            this.showScore(false);
            return;
        }
        this.showScore(true);
        if (final) {
            if (this.data.isStand) {
                const total = this.data.total[this.data.total.length - 1];
                this.scoreValue.string = total;
                if (total > 21) {
                    this.burstNode.active = true;
                    this.showScore(false);
                } else if (total === 21 && this.data.cards.length === 2 && !this.isSplit) {
                    this.blackJackNode.active = true;
                    this.showScore(false);
                }
            } else {
                this.scoreValue.string = this.data.total.join(' / ');
            }
        } else {
            const card = this.data.cards[0];
            const values = BlackJackUtils.getValues(card.rank);
            this.scoreValue.string = values.join(' / ');
        }
    }

    showScoreWithOutData(cards: CardModel[], cardNum: number, final = false) {
        this.showScore(true);
        const values = BlackJackUtils.getTotal(cards, cardNum);
        if (final) {
            const total = values[values.length - 1];
            this.scoreValue.string = total.toString();
            if (total > 21) {
                this.burstNode.active = true;
                this.showScore(false);
            } else if (total === 21 && cards.length === 2) {
                this.blackJackNode.active = true;
                this.showScore(false);
            }
        } else {
            this.scoreValue.string = values.join(' / ');
        }
    }

    showClearBetButton(show: boolean) {
        this.clearBetButton && (this.clearBetButton.active = show);
    }

    enablePlaceChip(enable: boolean) {
        this.betPlace && (this.betPlace.interactable = enable);
    }

    highlightPlace(highlight: boolean) {
        this.betPlace && (this.betPlace.node.children[0].active = highlight);
    }

    showHandId(show: boolean) {
        this.handId.node.active = show;
    }

    setHandId(id: string) {
        this.handId.string = `#${id}`;
        this.showHandId(true);
    }

    showResult(show: boolean) {
        this.resultValue.node.parent.active = show;
    }

    setResult(result: string) {
        this.resultValue.string = `+${helper.numberWithCommas(result)}`;
        this.showResult(true);
    }

    showErrorNotice() {
        if (this.errorNode) {
            this.errorNode.active = true;
            cc.tween(this.errorNode)
                .delay(2.5)
                .call(() => this.errorNode.active = false)
                .start();
        }
    }

    showBetText(show: boolean) {
        this.betText && (this.betText.active = show);
    }
}
