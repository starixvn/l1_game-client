import DataHandler from "../../../_base/handlers/DataHandler";
import MiniKenoProViet from "../MiniKenoProViet";

export default class MiniKenoProVietRoundsHandler implements DataHandler {
    constructor(protected readonly main: MiniKenoProViet) {
    }

    handle(data: any): boolean {
        if (data.rounds) {
            this.main.rounds = data.rounds;
            this.main.roundsSelection && this.main.roundsSelection.setData(data.rounds);
        }

        return true;
    }
}