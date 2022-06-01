import BlockchainBaccaratConfigsHandler from "../event-handlers/BlockchainBaccaratConfigsHandler";
import BlockchainBaccaratHandler from "../event-handlers/BlockchainBaccaratHandler";
import BlockchainBaccaratRoundHistoryHandler from "../event-handlers/BlockchainBaccratRoundHistoryHandler";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";
import { GameData } from "./../../_new/_base/game-data-management/models/game-data";
import BlockchainBaccaratConfigsModel from "./BlockchainBaccaratConfigsModel";
import { BlockchainBaccaratFinishModel } from "./BlockchainBaccaratFinishModel";
import BlockchainBaccaratModel from "./BlockchainBaccaratModel";
import BlockchainBaccaratRoundHistoryModel from "./BlockchainBaccaratRoundHistoryModel";
const { ccclass } = cc._decorator;

@ccclass
export default class BlockchainBaccaratGameData<Choices> extends GameData<Choices> {
    static Events = {
        SETTLED: "settled"
    };

    readonly configs: BlockchainBaccaratConfigsModel;
    readonly blockchain: BlockchainBaccaratModel;
    readonly roundHistory: BlockchainBaccaratRoundHistoryModel;
    readonly finishModel: BlockchainBaccaratFinishModel;

    constructor(mainGame: BlockchainBaccarat) {
        super();
        this.configs = new BlockchainBaccaratConfigsModel();
        this.blockchain = new BlockchainBaccaratModel();
        this.roundHistory = new BlockchainBaccaratRoundHistoryModel();
        this.finishModel = new BlockchainBaccaratFinishModel();
    }

    protected registerEventHandlers() {
        const handlers = [BlockchainBaccaratConfigsHandler, BlockchainBaccaratHandler, BlockchainBaccaratRoundHistoryHandler];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
