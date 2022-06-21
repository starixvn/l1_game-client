import {
    BlockchainBaccaratConfigsHandler,
    BlockchainBaccaratCardListHandler,
    BlockchainBaccaratRoundHistoryHandler,
    BlockchainBaccaratTotalBetHandler,
    BlockchainBaccaratFinishHandler,
    BlockchainBaccaratNewBlockchainHandler
} from "../event-handlers/BlockchainBaccaratHandler";
import {
    BlockchainBaccaratConfigsModel,
    BlockchainBaccaratFinishModel,
    BlockchainBaccaratRoundHistoryModel,
    BlockchainBaccaratCardListModel,
    BlockchainBaccaratTotalBetModel
} from "../event-models/BlockchainBaccaratModel";
import { GameData } from "./../../_new/_base/game-data-management/models/game-data";
const { ccclass } = cc._decorator;

@ccclass
export default class BlockchainBaccaratGameData<Choices> extends GameData<Choices> {
    static Events = {
        SETTLED: "settled"
    };

    readonly configs: BlockchainBaccaratConfigsModel;
    readonly cardList: BlockchainBaccaratCardListModel;
    readonly roundHistory: BlockchainBaccaratRoundHistoryModel;
    readonly finishModel: BlockchainBaccaratFinishModel;
    readonly totalBet: BlockchainBaccaratTotalBetModel;

    constructor() {
        super();
        this.configs = new BlockchainBaccaratConfigsModel();
        this.cardList = new BlockchainBaccaratCardListModel();
        this.roundHistory = new BlockchainBaccaratRoundHistoryModel();
        this.finishModel = new BlockchainBaccaratFinishModel();
        this.totalBet = new BlockchainBaccaratTotalBetModel();
    }

    protected registerEventHandlers() {
        const handlers = [
            BlockchainBaccaratConfigsHandler,
            BlockchainBaccaratCardListHandler,
            BlockchainBaccaratRoundHistoryHandler,
            BlockchainBaccaratTotalBetHandler,
            BlockchainBaccaratFinishHandler,
            BlockchainBaccaratNewBlockchainHandler
        ];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
