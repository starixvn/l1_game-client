import { HoldemPokerFinishModel } from "./../../holdem-poker/event-models/HoldemPokerFinishModel";
import TexasChoicesModel from "./texas-choices-model";

export default class TexasFinishModel extends HoldemPokerFinishModel {
    changeSettlementResult(settlementResult: TexasChoicesModel) {
        super.changeSettlementResult(settlementResult);
    }
}
