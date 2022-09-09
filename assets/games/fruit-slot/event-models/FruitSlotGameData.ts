import { FruitSlotRoundHistory, FruitSlotRoundHistoryHandler } from "./../event-handlers/FruitSlotRoundHistoryHandler";
import { GameData } from "../../_new/_base/game-data-management/models/game-data";
import { History } from "../../_new/_base/game-data-management/models/history";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotGameData extends GameData {
    static Events = {
        SETTLED: "settled"
    };
    readonly roundHistory: History<FruitSlotRoundHistory>;

    constructor() {
        super();
        this.roundHistory = new History<FruitSlotRoundHistory>();
    }

    protected registerEventHandlers() {
        const handlers = [FruitSlotRoundHistoryHandler];
        this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    }
}
