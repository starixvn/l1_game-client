
import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseNoticeHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (!data.notice) {
            return false;
        }

        this.main.showProcessingWarning(false);
        this.main.showMiniWarning(data.notice);
        return true;
    }
}
