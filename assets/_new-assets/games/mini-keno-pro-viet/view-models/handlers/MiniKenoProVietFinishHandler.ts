import MiniKenoFinishHandler from "../../../mini-keno/view-models/handlers/MiniKenoFinishHandler";
import MiniKenoProViet from "../MiniKenoProViet";

export default class MiniKenoProVietFinishHandler extends MiniKenoFinishHandler {
    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }


    protected handleResult(onFinishHanlingData: () => void) {
        if (this.main.isIncomingGameRound) {
            super.handleResult(onFinishHanlingData);
        }else {
            this.showBetStatus();
        }
    }
}
