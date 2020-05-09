import DataHandler from "./DataHandler";
import GameBase from "../GameBase";

export default class GameBaseHistoryHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.history) {
            this.renderHistory(data.history);

            return true;
        }

        return false;
    }

    renderHistory(data: any): void {
    }
}