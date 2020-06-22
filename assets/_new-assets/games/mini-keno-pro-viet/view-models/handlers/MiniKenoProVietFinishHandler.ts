import MiniKenoProViet from "../MiniKenoProViet";
import MiniKenoFinishHandler from "../../../mini-keno/view-models/handlers/MiniKenoFinishHandler";

export default class MiniKenoProVietFinishHandler extends MiniKenoFinishHandler {
    constructor(protected readonly main: MiniKenoProViet) {
        super(main);
    }

    protected handleResult(onFinishHanlingData: () => void) {
        if (this.main.isIncomingGameRound) {
            super.handleResult(onFinishHanlingData)
        }
    }

    highlightWonItem(results: any = null, isAnimated = true) {
        super.highlightWonItem(results, isAnimated && this.main.isIncomingGameRound);
    }
}
