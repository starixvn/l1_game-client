import { FruitSlotRoundHistory, FruitSlotRoundHistoryHandler } from "./../event-handlers/FruitSlotRoundHistoryHandler";
import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import { History } from "../../_new/_base/game-data-management/models/history";
import NewGameData from "../../_base_new/models/NewGameData";
import { FruitSlotPlaceBetModel } from "./FruitSlotPlaceBetModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotGameData extends NewGameData {
    static Events = {
        SETTLED: "settled"
    };
    readonly roundHistory: History<FruitSlotRoundHistory>;
    readonly placeBetModel: FruitSlotPlaceBetModel;

    constructor() {
        super();
        this.roundHistory = new History<FruitSlotRoundHistory>();
        this.placeBetModel = new FruitSlotPlaceBetModel();
    }

    protected registerEventHandlers() {
        const handlers = [FruitSlotRoundHistoryHandler];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }

    receiveUIData(data: any) {
        if (!!data.double) {
            this.placeBetModel.double(data.double.choice, data.double.amount);
        }
    }
}
