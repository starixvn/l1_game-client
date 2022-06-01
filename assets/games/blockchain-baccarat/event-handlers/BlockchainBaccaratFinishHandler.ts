import { BlockchainBaccaratChoicesType } from "../BlockchainBaccaratType";
import { BlockchainBaccarat } from "../event-models/BlockchainBaccaratCardListModel";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BaseEventHandler } from "./../../_new/_base/game-data-management/event-handlers/base-handler";

export type Card = {
    card1: CardValue;
    card2: CardValue;
    card3?: CardValue;
};

export type CardValue = {
    value: number;
    suit: number;
};

export type Result = {
    player: Card;
    banker: Card;
};

export type BlockchainBaccaratFinish<Choices> = {
    finish: {
        result: Result;
        settlementResult: BlockchainBaccaratChoicesType;
        winningPlayers: any[];
        roundId: string;
        blockchain: BlockchainBaccarat;
    };
};

export default class BlockchainBaccaratFinishHandler<Choices> extends BaseEventHandler<BlockchainBaccaratFinish<Choices>, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratFinish<Choices>) {
        return !!event.finish;
    }
    protected handle(event: BlockchainBaccaratFinish<Choices>) {
        const { settlementResult, result, roundId, blockchain } = event.finish;

        this.gameData.emit(BlockchainBaccaratGameData.Events.SETTLED, this);
        this.gameData.finishModel.changeSettlementResult(settlementResult);
    }
}
