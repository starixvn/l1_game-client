import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { CardModel } from "../texas-type";

export default class TexasHoldModel extends EventEmitterBase {
    static Events = {
        CHANGE: "afterHold:change"
    };

    playerCards: CardModel[];
    combinationResult: any;
    roundId: number;

    changeDataAfterHold(playerCards: CardModel[], combinationResult: any, roundId: number) {
        this.playerCards = playerCards;
        this.roundId = roundId;
        this.combinationResult = combinationResult;
        this.emit(TexasHoldModel.Events.CHANGE, this);
    }
}
