import NewCard from "../../../common/new-card/view-models/NewCard";
import CardLayout from "./CardLayout";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HandPlace extends cc.Component {
    @property(cc.Node)
    betPlace: cc.Node = null;

    @property(CardLayout)
    cardLayout: CardLayout = null;

    @property(cc.Node)
    clearBetButton: cc.Node = null;

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
    private _betAmount = 0;
    public betItemClickCallback = () => { }
    public clearBetClickCallback = () => { }

    onLoad() {
        this.clearBetButton.on('click', this.onClearBetClick, this);
        this.clearBetButton.active = false;
    }

    updateDisplay() {
        this.cardLayout.shadow.active = this.selected;
        this.cardLayout.changeCardView(this.selected);
    }

    onBetItemClick() {
        this.betItemClickCallback();
    }

    onClearBetClick() {
        this.clearBetClickCallback();
        this.clearBetButton.active = false;
    }

    getBetAmount(): number {
        return this._betAmount;
    }

    addBetAmount(amount: number) {
        this._betAmount += amount;
    }

    clearBetAmount() {
        this._betAmount = 0;
    }

    addCard(card: cc.Node) {
        this.cardLayout.content.addChild(card);
    }
}
