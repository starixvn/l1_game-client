import EventEmitterBase from "../../../common/emitter/EventEmitterBase";
import FruitSlotChoices from "./FruitSlotChoices";

export class FruitSlotPlaceBetModel extends EventEmitterBase {
    constructor() {
        super();
        this.choices = new FruitSlotChoices();
        this.previousChoices = new FruitSlotChoices();
    }

    static Events = {
        DOUBLE: "double",
        UPDATE_CHIPS: "updateChips",
    }

    choices: any;
    previousChoices: any;

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
