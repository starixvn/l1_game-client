import DataHandler from "./DataHandler";
import GameBase from "../GameBase";

export default class GameBaseErrorHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (data.apiError) {
            return true;
        }

        if (data.err) {
            this.main.showMiniWarning(data.err);
            return true;
        }

        return false;
    }

}