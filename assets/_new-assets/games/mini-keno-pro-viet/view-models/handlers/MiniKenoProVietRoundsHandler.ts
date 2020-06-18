import DataHandler from "../../../_base/handlers/DataHandler";
import MiniKenoProViet from "../MiniKenoProViet";

export default class MiniKenoProVietRoundsHandler implements DataHandler {
    constructor(protected readonly main: MiniKenoProViet) {
    }

    handle(data: any): boolean {
        if (data.rounds) {
            const roundsSelection = this.main.initRoundSelectionPopup();
            roundsSelection.setData(data.rounds);
        }

        return true;
    }
}