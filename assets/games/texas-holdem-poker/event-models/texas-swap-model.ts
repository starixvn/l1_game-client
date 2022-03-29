import { EventEmitter } from "events";
import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import { CardModel } from "../texas-type";

export default class TexasSwapModel extends EventEmitterBase {
    static Events = {
        CHANGE: "afterSwap:change"
    };

    playerCards: CardModel[];
    combinationResult: any;
    roundId: number;

    changeDataAfterSwap(playerCards: CardModel[], combinationResult: any, roundId: number) {
        this.playerCards = playerCards;
        this.roundId = roundId;
        this.combinationResult = combinationResult;
        this.emit(TexasSwapModel.Events.CHANGE, this);
    }
}
