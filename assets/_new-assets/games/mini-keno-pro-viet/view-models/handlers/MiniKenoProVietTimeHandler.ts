import MiniKenoProViet from "../MiniKenoProViet";
import MiniKenoTimeHandler from "../../../mini-keno/view-models/handlers/MiniKenoTimeHandler";

export default class MiniKenoProVietTimeHandler extends MiniKenoTimeHandler {

    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();

        if (this.main.roundId == this.main.incomingRoundId) {
            this.main.stopBetWarning.active = true;
            this.main.betBoard.onClose();
        } else {
            this.main.stopBetWarning.active = false;
        }
    }
}
