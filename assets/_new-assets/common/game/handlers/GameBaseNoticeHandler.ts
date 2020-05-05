
import DataHandler from "../../_base/view-models/DataHandler";
import GameBase from "../GameBase";

export default class GameBaseNoticeHandler implements DataHandler {
    constructor(private readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (!data.notice) {
            return false;
        }

        this.main.showProcessingWarning(false);
        this.main.addNotice(data.notice);
        return true;
    }
}
