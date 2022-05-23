import BlockchainBaccaratConfigsHandler from "../event-handlers/BlockchainBaccaratConfigsHandler";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";
import { GameData } from "./../../_new/_base/game-data-management/models/game-data";
import BlockchainBaccaratConfigsModel from "./BlockchainBaccaratConfigsModel";
const { ccclass } = cc._decorator;

@ccclass
export default class BlockchainBaccaratGameData<Choices> extends GameData<Choices> {
    static Events = {};

    readonly configs: BlockchainBaccaratConfigsModel;

    constructor(mainGame: BlockchainBaccarat) {
        super();
        this.configs = new BlockchainBaccaratConfigsModel();
    }

    protected registerEventHandlers() {
        const handlers = [BlockchainBaccaratConfigsHandler];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
