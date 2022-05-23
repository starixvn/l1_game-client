import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BaseEventHandler } from "./../../_new/_base/game-data-management/event-handlers/base-handler";

export type CardChain = {
    card: { value: 7; suit: 2 };
    hashValue: string;
    rawValue?: string;
    revealedRawValue: string;
};
export type Blockchain = {
    burnedCards: number;
    chain: Array<CardChain>;
    currentIndex: number;
    cutCardIndex: number;
};
export type BlockchainBaccaratFinishType<Choices> = {
    finish: {
        blockchain: Blockchain;
        burnedCards: number;
        currentIndex: number;
        cutCardIndex: number;
    };
};

export default class BlockchainBaccaratFinishHandler<Choices> extends BaseEventHandler<BlockchainBaccaratFinishType<Choices>, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;
    protected verifyEvent(event: BlockchainBaccaratFinishType<Choices>) {
        return !!event.finish;
    }
    protected handle(event: any) {
        // handle
    }
}
