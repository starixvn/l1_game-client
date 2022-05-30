import { BaseEventHandler } from "../../_new/_base/game-data-management/event-handlers/base-handler";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BlockchainBaccaratRoundHistory } from "../event-models/BlockchainBaccaratRoundHistory";

export type BlockchainBaccaratRoundHistoryType<Choices> = {
    roundHistory: {
        roundId: number;
        result: {
            banker: boolean;
            bankerPair: boolean;
            big: boolean;
            natural: boolean;
            player: boolean;
            playerPair: boolean;
            small: boolean;
            tie: boolean;
        };
    }[];
};

export default class BlockchainBaccaratRoundHistoryHandler<Choices> extends BaseEventHandler<
    BlockchainBaccaratRoundHistoryType<Choices>,
    Choices
> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratRoundHistoryType<Choices>) {
        return event.roundHistory && event.roundHistory.length !== 0;
    }

    protected handle(event: BlockchainBaccaratRoundHistoryType<Choices>) {
        const rounds = this.transformToRound(event);

        this.gameData.roundHistory.cleanWithoutTriggerEvent();
        this.gameData.roundHistory.push(...rounds);
    }

    transformToRound(event: BlockchainBaccaratRoundHistoryType<Choices>): BlockchainBaccaratRoundHistory[] {
        return event.roundHistory.map((round) => {
            const newRound = new BlockchainBaccaratRoundHistory();
            newRound.roundId = round.roundId;
            newRound.result = round.result;
            return newRound;
        });
    }
}
