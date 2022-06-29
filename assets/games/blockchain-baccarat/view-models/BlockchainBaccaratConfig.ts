import { BlockchainConfig } from "./../event-models/BlockchainBaccaratConfigsModel";

export class BlockchainBaccaratConfig implements BlockchainConfig {
    minBetTime = 1;
    fullTime = 45;
    fullTimeNewShoe = 55;
    betTime = 30;
    stopBetTime = 5;
    waitTime = 20;
}
