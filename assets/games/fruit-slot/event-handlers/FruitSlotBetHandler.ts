import GameRoomBaseBetHandler from "../../_base/handlers/GameRoomBaseBetHandler";
import FruitSlot from "../view-models/FruitSlot";

export class FruitSlotBetHandler extends GameRoomBaseBetHandler {
    constructor(protected readonly main: FruitSlot) {
        super(main);
    }
}
