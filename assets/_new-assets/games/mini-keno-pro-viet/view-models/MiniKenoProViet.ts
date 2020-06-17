import MiniKeno from "../../mini-keno/view-models/MiniKeno";
import MiniKenoProVietConfig from "./MiniKenoProVietConfig";
import MiniKenoProVietRoundsSelection from "./components/MiniKenoProVietRoundsSelection";
import MiniKenoProVietRoundsHandler from "./handlers/MiniKenoProVietRoundsHandler";
import MiniKenoProVietTimeHandler from "./handlers/MiniKenoProVietTimeHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoProViet extends MiniKeno {
    @property(cc.Prefab)
    roundsSelectionPrefab: cc.Prefab = null;

    roundsHandler: MiniKenoProVietRoundsHandler;

    get incomingRoundId() {
        return this.currentDataLogs[0].roundId + 1;
    }

    private roundsSelection: MiniKenoProVietRoundsSelection;

    onLoad() {
        super.onLoad();

        this.addHandlers(this.roundsHandler)
    }

    init() {
        super.init();
        this.config = new MiniKenoProVietConfig();
    }

    initHandlers() {
        super.initHandlers();

        this.roundsHandler = new MiniKenoProVietRoundsHandler(this);
        this.timeHandler = new MiniKenoProVietTimeHandler(this)
    }

    protected sendBet(betAmount, betChoice) {
        this.bet({ bet: { amount: betAmount, betChoice: betChoice, roundId: this.roundId } });
    }

    getGameRounds() {
        this.sendData({ "getRounds": true });
    }

    changeRound(roundId: string) {
        this.resetDataAndUI();
        this.sendData({ getPlayerBets: true, roundId: roundId });
        this.roundId = parseInt(roundId);
    }

    initRoundSelectionPopup(): MiniKenoProVietRoundsSelection {
        if (this.roundsSelection && this.roundsSelection.node) {
            return this.roundsSelection;
        }

        const roundsSelectionNode = cc.instantiate(this.roundsSelectionPrefab);
        this.roundsSelection = roundsSelectionNode.getComponent(MiniKenoProVietRoundsSelection);
        this.roundsSelection.node.active = false;
        this.center.addChild(this.roundsSelection.node);
        this.roundsSelection.init(this);

        return this.roundsSelection;
    }

}
