import { EventEmitter } from "events";

export class TexasHoldemPokerSettlement extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0);
  }

  static Events = {
    START_SETTLEMENT: "startSettlement",
    START_SHOW_CARDS: "startShowCards",
    START_AUTO_CHECK: "startAutoCheck",
  };

  isWaiting: boolean = false;
  isAutoSettle: boolean = false;

  set waiting(value: boolean) {
    this.isWaiting = value;
  }
  set autoSettle(value: boolean) {
    this.isAutoSettle = value;
  }

  startSettlement() {
    if (this.isWaiting && !this.isAutoSettle) {
      this.emit(TexasHoldemPokerSettlement.Events.START_SHOW_CARDS, this);
    }
    if (this.isWaiting && this.isAutoSettle) {
      this.emit(TexasHoldemPokerSettlement.Events.START_AUTO_CHECK, this);
    }
    if (!this.isWaiting) {
      this.emit(TexasHoldemPokerSettlement.Events.START_SETTLEMENT, this);
    }
  }

  finishShowCards() {
    this.emit(TexasHoldemPokerSettlement.Events.START_SETTLEMENT, this);
  }
}
