import { HoldemPokerFinishModel } from "./../../holdem-poker/event-models/HoldemPokerFinishModel";
import TexasHoldemPokerChoices from "./texas-holdem-poker-choices";

export default class TexasHoldemPokerFinishModel extends HoldemPokerFinishModel {
    changeSettlementResult(settlementResult: TexasHoldemPokerChoices) {
        super.changeSettlementResult(settlementResult);
    }
}
