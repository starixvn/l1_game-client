import { EventEmitter } from "events";
/* import HoldemPokerChoices from "./HoldemPokerChoices";
 */
export class TexasHoldemPokerFinishModel extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0);
  }

  static Events = {
    CHANGE_SETTLEMENT: "settlement:change",
    SHOWED_CARDS: "cards:showed",
    SHOWED_ANIMATION: "animation:showed",
  };

  settlementResult: any;

  changeSettlementResult(settlementResult: any) {
    this.settlementResult = settlementResult;

    this.emit(TexasHoldemPokerFinishModel.Events.CHANGE_SETTLEMENT, this);
  }

  finishAnimationWinning() {
    this.emit(TexasHoldemPokerFinishModel.Events.SHOWED_ANIMATION, this);
  }
}
