import GameBase from "../GameBase";
import { showWinningEffectForPlayers } from "../action/PayChipsAction";
import DataHandler from "./DataHandler";

export default class GameBaseWinnersHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {}

    handle(data: any) {
        if (data.winners) {
            this.main.winnersData = data.winners.winningPlayers;
            if (this.main.timeHandler.isInWaitTime && this.main.finishShowResult) {
                showWinningEffectForPlayers(this.main, this.main.winnersData);
                this.main.winnersData = null;
            }
        }
    }
}
