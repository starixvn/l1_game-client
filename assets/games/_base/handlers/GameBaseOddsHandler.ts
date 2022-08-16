import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseOddsHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {}

    handle(data: any) {
        if (data.odds) {
            this.main.setBoostedChoices(data.odds?.boostedChoices);
            this.main.updateOdds(data.odds.values);
        }
    }
}
