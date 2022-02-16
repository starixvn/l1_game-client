import { EventEmitter } from "events";
import { CardModel } from "../../../common/new-card/view-models/NewCard";
import { HiLoStakeModel } from "./HiLoStakeModel";

export type BetType = {
    roundId: number;
    result: Array<Record<string, number>>;
    nextAmounts: { h: number; l: number };
    remainingTime: number;
    betwin: number;
    totalTurns: number;
    amount: number;
};

export class HiLoOwnBetsModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
    }

    static Events = {
        CHANGE: "ownBets:change"
    };

    roundId: number;
    result: CardModel[];
    nextAmount: HiLoStakeModel;
    remainingTime: number;
    betwin: number;
    totalTurns: number;
    amount: number;

    change(data: BetType, eventName: string) {
        const { roundId, betwin, result, nextAmounts, remainingTime, totalTurns, amount } = data;
        const nextAmountModel = new HiLoStakeModel();
        nextAmounts && nextAmountModel.change(nextAmounts.h, nextAmounts.l, betwin);
        this.nextAmount = nextAmountModel;
        this.remainingTime = remainingTime;
        this.roundId = roundId;
        this.totalTurns = totalTurns;
        this.amount = amount;

        this.result = result.map((c) => {
            return { rank: c.rank.toString(), suit: c.suit };
        });

        this.emit(eventName, this);
    }
}
