import { BlockchainBaccaratConfigData } from "./../event-models/BlockchainBaccaratConfigsModel";
import { BlockchainBaccaratOdds, BCBaccaratMaxBetPerChoices } from "../event-models/BlockchainBaccaratConfigsModel";
import { BaseEventHandler } from "./../../_new/_base/game-data-management/event-handlers/base-handler";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";

export type BlockchainBaccaratConfigType<Choices> = {
    gameConfigs: {
        chips: string[];
        enableFreeBet: boolean;
        groupId: number;
        maxBet: number;
        minBet: number;
        maxBetPerChoices: BCBaccaratMaxBetPerChoices;
        odds: BlockchainBaccaratOdds;
        stakeLevels: string[];
        _id: string;
    };
};

export class BlockchainBaccaratConfigsHandler<Choices> extends BaseEventHandler<BlockchainBaccaratConfigType<Choices>, Choices> {
    protected readonly gameData: BlockchainBaccaratGameData<Choices>;

    protected verifyEvent(event: BlockchainBaccaratConfigType<Choices>) {
        return event.gameConfigs != null;
    }

    protected handle(event: BlockchainBaccaratConfigType<Choices>) {
        this.gameData.configs.change(event.gameConfigs as BlockchainBaccaratConfigData);
    }
}
