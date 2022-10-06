import GameBase from "../../_base/GameBase";
import Connection from "../../_new/connection/Connection";
import { events } from "../../_new/connection/SocketIOConnection";
import FruitSlotGameData from "../event-models/FruitSlotGameData";

export default class FruitSlotPlacingBet {
    private readonly gameData: FruitSlotGameData = null;
    private readonly gameBase: GameBase = null;
    private readonly getConnection: () => Connection;

    constructor(gameData: FruitSlotGameData, gameBase: GameBase, getConnection: () => Connection) {
        this.gameData = gameData;
        this.gameBase = gameBase;
        this.getConnection = getConnection;
    }

    doubleBet(betChoice: string, betAmount: number) {
        // console.log("buttonDouble", betChoice, betAmount);
        // this.gameData.receiveUIData({ bet: { choice: betChoice, amount: betAmount * 2 } });

        this.getConnection().emit(events.bet, {
            action: betChoice,
            anteBet: betAmount * 2
        });
    }
}
