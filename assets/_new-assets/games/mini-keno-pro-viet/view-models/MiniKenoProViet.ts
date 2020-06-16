import MiniKenoProVietLogsHandler from "./handlers/MiniKenoProVietLogsHandler";
import MiniKeno from "../../mini-keno/view-models/MiniKeno";
import MiniKenoProVietConfig from "./MiniKenoProVietConfig";

const { ccclass, property } = cc._decorator;


@ccclass
export default class MiniKenoProViet extends MiniKeno {
    onLoad() {
        super.onLoad();
    }

    init() {
        super.init();
        this.config = new MiniKenoProVietConfig();
    }

    initHandlers() {
        super.initHandlers();

        this.logsHandler = new MiniKenoProVietLogsHandler(this);
    }

    protected sendBet(betAmount, betChoice) {
        this.bet({ bet: { amount: betAmount, betChoice: betChoice, roundId: this.roundId } });
    }

    getGameRounds() {
        this.sendData({ "getRounds": true });
    }
}
