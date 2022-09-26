import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import FruitSlotChoices from "./FruitSlotChoices";

export class FruitSlotPlaceBetModel extends EventEmitterBase {
    constructor() {
        super();
        this.choices = new FruitSlotChoices();
        this.previousChoices = new FruitSlotChoices();
    }

    static Events = {
        PLACE_BET: "placeBet",
        PLACE_BET_CHIPS: "placeBetChips",
        DOUBLE: "double",
        UPDATE_CHIPS: "updateChips",
    }

    choices: any;
    previousChoices: any;

    placeBet(choice: string, amount: number) {
        this.choices
    }

    double(choice: string, amount: number) {
        this.choices[choice] = this.choices[choice] * 2;
        this.emit(FruitSlotPlaceBetModel.Events.DOUBLE, this);
        this.emit(FruitSlotPlaceBetModel.Events.UPDATE_CHIPS, {
            choice: choice,
            totalAmount: this.choices[choice],
            currentAmount: amount
        });
    }
}
