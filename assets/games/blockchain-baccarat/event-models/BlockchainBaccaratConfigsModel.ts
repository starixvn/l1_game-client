import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export type BCBaccaratMaxBetPerChoices = {
    banker: number;
    bankerPair: number;
    big: number;
    player: number;
    playerPair: number;
    small: number;
    tie: number;
};

export type BlockchainBaccaratOdds = {
    banker: number;
    bankerPair: number;
    big: number;
    player: number;
    playerPair: number;
    small: number;
    tie: number;
};

export type BlockchainBaccaratConfigData = {
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

export default class BlockchainBaccaratConfigsModel extends EventEmitterBase {
    static Events = {
        CHANGE: "configs:change"
    };

    gameConfigs: BlockchainBaccaratConfigData;

    change(configs: BlockchainBaccaratConfigData) {
        this.gameConfigs = configs;
        this.emit(BlockchainBaccaratConfigsModel.Events.CHANGE, configs);
    }
}
