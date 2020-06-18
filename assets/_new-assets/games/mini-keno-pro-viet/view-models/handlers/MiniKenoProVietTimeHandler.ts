import MiniKenoProViet from "../MiniKenoProViet";
import MiniKenoTimeHandler from "../../../mini-keno/view-models/handlers/MiniKenoTimeHandler";
import * as moment from "moment";

export default class MiniKenoProVietTimeHandler extends MiniKenoTimeHandler {

    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }

    playTime() {
        if (this.main.isIncomingGameRound) {
            super.playTime();
        }
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();

        this.main.getPlayerBets(this.main.roundId.toString());
    }
}
