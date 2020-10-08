import * as helper from "../../../common/helpers/Helper";
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
}

const { ccclass, property } = cc._decorator;
@ccclass
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
    statusValue: cc.Label = null;

    @property(cc.Label)
    resultValue: cc.Label = null;

    @property(cc.Label)
    handId: cc.Label = null;

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
        if (cards.length < 2) {
            return false;
        }

        return BlackJackUtils.getValue(cards[0].rank) === BlackJackUtils.getValue(cards[1].rank) && !this.data.splitFrom;
    }

    get canDouble() {
        const cards = this.data.cards;
        if (cards.length < 2) {
            return false;
        }

        const total = BlackJackUtils.getValue(cards[0].rank) + BlackJackUtils.getValue(cards[1].rank);
        return total > 8 && total < 12 && !this.data.splitFrom;
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

        this.betValue && this.showBetValue(false);
        this.showStatus(false);
        this.handId && this.showHandId(false);
        this.resultValue && this.showResult(false);
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
        this.clearBetClickCallback();
        this.resetView();
        this.clearBetAmount();
        this.clearData();
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
        this.betValue.node.parent.active = show;
    }

    updateDisplayBetValue(bet: number) {
        this.showBetValue(true);
        this.betValue.string = helper.numberWithCommas(bet);
    }

    syncBetValue() {
        this.updateDisplayBetValue(this.data.bet);
        this._betAmount = this.data.bet;
    }

    showStatus(show: boolean) {
        this.statusValue.node.parent.active = show;
    }

    updateDisplayStatus(data: any) {
        this.showStatus(true);
        if (Array.isArray(data)) {
            this.statusValue.string = `${data[0]} / ${data[1]}`;
        } else {
            this.statusValue.string = data;
        }
    }

    showClearBetButton(show: boolean) {
        this.clearBetButton.active = show;
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
}
