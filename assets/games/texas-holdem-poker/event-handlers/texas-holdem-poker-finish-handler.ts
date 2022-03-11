import { cloneDeep } from "lodash";
import TexasHoldemPokerGameData from "../event-models/texas-holdem-poker-game-data";
import { cloneDeepChoiceData } from "../texas-helper";
import TexasHoldemPokerEventHandler from "./texas-holdem-poker-event-handler";

export type TexasHoldemPokerFinish = {
    finish: {
        settlementResult: {
            aa: number;
            ante: number;
            call: number;
        };
    };
};

export default class TexasHoldemPokerFinishHandler<Choices> extends TexasHoldemPokerEventHandler<TexasHoldemPokerFinish, Choices> {
    protected verifyEvent(event: TexasHoldemPokerFinish) {
        return !!event.finish;
    }

    protected handle(event: TexasHoldemPokerFinish) {
        this.gameData.isProcessingBet = false;
        const { settlementResult } = event.finish;

        const settlementResultConverted = cloneDeepChoiceData(settlementResult);
        // const settlementResultConverted: any = {};

        // settlementResultConverted["anteBet"] = cloneDeep(settlementResult["ante"]);
        // settlementResultConverted["callBet"] = cloneDeep(settlementResult["call"]);
        // settlementResultConverted["riverBet"] = cloneDeep(settlementResult["river"]);
        // settlementResultConverted["turnBet"] = cloneDeep(settlementResult["turn"]);

        // console.log(settlementResultConverted, "settlementResultConverted");
        // console.log(settlementResultConvertedTEst);

        this.gameData.emit(TexasHoldemPokerGameData.Events.SETTLED, this);
        this.gameData.finishModel.changeSettlementResult(settlementResultConverted);
    }
}
