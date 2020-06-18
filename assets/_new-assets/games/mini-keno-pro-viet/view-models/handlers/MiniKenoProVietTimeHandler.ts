import MiniKenoProViet from "../MiniKenoProViet";
import MiniKenoTimeHandler from "../../../mini-keno/view-models/handlers/MiniKenoTimeHandler";

export default class MiniKenoProVietTimeHandler extends MiniKenoTimeHandler {

    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }

    playTime() {
        if (this.main.isIncomingGameRound) {
            super.playTime();
        }
    }
}
