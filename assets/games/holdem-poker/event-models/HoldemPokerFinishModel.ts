import { EventEmitter } from "events";
import HoldemPokerChoices from "./HoldemPokerChoices";

export class HoldemPokerFinishModel extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0);
  }

  static Events = {
    CHANGE_SETTLEMENT: "settlement:change",
    SHOWED_CARDS: "cards:showed",
    SHOWED_ANIMATION: "animation:showed",
  };

  settlementResult: HoldemPokerChoices;

  changeSettlementResult(settlementResult: HoldemPokerChoices) {
    this.settlementResult = settlementResult;
    this.emit(HoldemPokerFinishModel.Events.CHANGE_SETTLEMENT, this);
  }

  finishAnimationWinning() {
    this.emit(HoldemPokerFinishModel.Events.SHOWED_ANIMATION, this);
  }
}
