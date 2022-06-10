import BlockchainBaccaratConfigsHandler from "../event-handlers/BlockchainBaccaratConfigsHandler";
import BlockchainBaccaratCardListHandler from "../event-handlers/BlockchainBaccaratCardListHandler";
import BlockchainBaccaratRoundHistoryHandler from "../event-handlers/BlockchainBaccratRoundHistoryHandler";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";
import { GameData } from "./../../_new/_base/game-data-management/models/game-data";
import BlockchainBaccaratConfigsModel from "./BlockchainBaccaratConfigsModel";
import { BlockchainBaccaratFinishModel } from "./BlockchainBaccaratFinishModel";
import BlockchainBaccaratRoundHistoryModel from "./BlockchainBaccaratRoundHistoryModel";
import BlockchainBaccaratCardListModel from "./BlockchainBaccaratCardListModel";
import BlockchainBaccaratTotalBetModel from "./BlockchainBaccaratTotalBetModel";
import BlockchainBaccaratTotalBetHandler from "../event-handlers/BlockchainBaccaratTotalBetHandler";
import BlockchainBaccaratFinishHandler from "../event-handlers/BlockchainBaccaratFinishHandler";
import BlockchainBaccaratNewBlockchainHandler from "../event-handlers/BlockchainBaccaratNewBlockchain";
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

    constructor(mainGame: BlockchainBaccarat) {
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
