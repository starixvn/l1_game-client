import GameBase from "../../_base/GameBase";
import Connection from "../../_new/connection/Connection";
import { events } from "../../_new/connection/SocketIOConnection";
import FruitSlotGameData from "../event-models/FruitSlotGameData";

export default class FruitSlotPlacingBet {
    private readonly gameData: FruitSlotGameData = null;

    doubleBet(betChoice: string, betAmount: number) {
        console.log("buttonDouble", betChoice, betAmount);
        this.gameData.receiveUIData({ double: { choice: betChoice, amount: betAmount } });
    }
}
