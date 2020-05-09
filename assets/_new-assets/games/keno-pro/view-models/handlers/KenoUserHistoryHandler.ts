import GameBaseHistoryHandler from "../../../_base/handlers/GameBaseHistoryHandler";
import Keno from "../Keno";

export default class KenoUserHistoryHandler extends GameBaseHistoryHandler {
    constructor(protected readonly main: Keno) {
        super(main);
    }

    renderHistory(data) {
        this.main.history.onData(data);
    }
}
