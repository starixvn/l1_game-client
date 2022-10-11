import NewGameData from "../../_base_new/models/NewGameData";
import FruitSlotChoices from "./FruitSlotChoices";
import { FruitSlotRoundHistoryHandler } from "../event-handlers/FruitSlotRoundHistoryHandler";
import { FruitSlotPlaceBetModel } from "./FruitSlotPlaceBetModel";
import { FruitSlotRoundHistoryModel } from "./FruitSlotRoundHistoryModel";

const { ccclass } = cc._decorator;

@ccclass
export default class FruitSlotGameData extends NewGameData {
    readonly placeBetModel: FruitSlotPlaceBetModel;
    totalBetAmount: FruitSlotChoices;

    constructor() {
        super();
        this.placeBetModel = new FruitSlotPlaceBetModel();
        this.totalBetAmount = new FruitSlotChoices();
    }

    // protected registerEventHandlers() {
    //     const handlers = [FruitSlotRoundHistoryHandler];
    //     this.eventHandlers.push(...handlers.map((Handler) => new Handler(this)));
    // }

    // receiveUIData(data: any) {
    //     if (!!data.bet) {
    //         // console.log("Placebet");
    //         this.placeBetModel.placeBet(data.bet.choice, data.bet.amount);
    //     }
    //     if (!!data.double) {
    //         this.placeBetModel.double(data.double.choice, data.double.amount);
    //     }
    // }
}
