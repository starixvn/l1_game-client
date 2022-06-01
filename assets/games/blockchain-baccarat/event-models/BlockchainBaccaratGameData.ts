import BlockchainBaccaratConfigsHandler from "../event-handlers/BlockchainBaccaratConfigsHandler";
import BlockchainBaccaratCardListHandler from "../event-handlers/BlockchainBaccaratCardListHandler";
import BlockchainBaccaratRoundHistoryHandler from "../event-handlers/BlockchainBaccratRoundHistoryHandler";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";
import { GameData } from "./../../_new/_base/game-data-management/models/game-data";
import BlockchainBaccaratConfigsModel from "./BlockchainBaccaratConfigsModel";
import { BlockchainBaccaratFinishModel } from "./BlockchainBaccaratFinishModel";
import BlockchainBaccaratRoundHistoryModel from "./BlockchainBaccaratRoundHistoryModel";
import BlockchainBaccaratCardListModel from "./BlockchainBaccaratCardListModel";
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

    constructor(mainGame: BlockchainBaccarat) {
        super();
        this.configs = new BlockchainBaccaratConfigsModel();
        this.cardList = new BlockchainBaccaratCardListModel();
        this.roundHistory = new BlockchainBaccaratRoundHistoryModel();
        this.finishModel = new BlockchainBaccaratFinishModel();
    }

    protected registerEventHandlers() {
        const handlers = [BlockchainBaccaratConfigsHandler, BlockchainBaccaratCardListHandler, BlockchainBaccaratRoundHistoryHandler];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
