import TexasHoldemPokerCardLayout from "./texas-holdem-poker-card-layout";

export interface HandModel {
  id: string;
  pos: number;
  bet: number;
  total: any;
  isStand: boolean;
  cards: any[];
  splitFrom: boolean;
  actions: string[];
}

const { ccclass, property, executeInEditMode, menu } = cc._decorator;
@ccclass
@executeInEditMode
export default class TexasHoldemPokerCardsPosition extends cc.Component {
  @property(TexasHoldemPokerCardLayout)
  cardLayout: TexasHoldemPokerCardLayout = null;

  @property
  _selected = false;

  @property
  get Selected() {
    return this._selected;
  }

  set Selected(value) {
    this._selected = value;
    this.updateDisplay();
  }

  private data: HandModel = null;

  get isActive() {
    return this.data != null;
  }

  get idValue() {
    return this.data.id;
  }

  updateDisplay() {
    this.cardLayout.shadow.active = this._selected;
    this.cardLayout.changeCardView(this._selected);
  }

  setData(data: HandModel) {
    this.data = { ...data };
  }

  clearData() {
    this.data = null;
  }

  addCard(card: cc.Node) {
    this.cardLayout.content.addChild(card, 1000);
  }

  getCards(): cc.Node[] {
    return this.cardLayout.content.children;
  }
}
