import MiniKeno from "../../mini-keno/view-models/MiniKeno";
import MiniKenoProVietConfig from "./MiniKenoProVietConfig";
import MiniKenoProVietRoundsSelection, { MiniKenoProVietRound } from "./components/MiniKenoProVietRoundsSelection";
import MiniKenoProVietRoundsHandler from "./handlers/MiniKenoProVietRoundsHandler";
import MiniKenoProVietTimeHandler from "./handlers/MiniKenoProVietTimeHandler";
import MiniKenoProVietRoundItem from "./components/MiniKenoProVietRoundItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoProViet extends MiniKeno {
    @property(cc.Prefab)
    roundsSelectionPrefab: cc.Prefab = null;

    static readonly TIME_FORMAT = "HH:mm";
    static readonly DATE_FORMAT = "DD/MM";
    static readonly FULL_DATE_FORMAT = "DD/MM/YYYY";

    roundsHandler: MiniKenoProVietRoundsHandler;
    rounds: MiniKenoProVietRound[];
    roundsSelection: MiniKenoProVietRoundsSelection;

    get isIncomingGameRound(): boolean {
        return !this.currentDataLogs || !this.currentDataLogs[0] || (this.roundId === this.currentDataLogs[0].roundId + 1);
    }

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

    showGameRoundsDialog() {
        cc.RedT.audio.playClick();
        this.initRoundSelectionPopup();
        this.getGameRounds();

        this.roundsSelection.node.active = true;
    }

    getGameRounds() {
        this.sendData({ "getRounds": true });
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.stopBetWarning.active = false;
    }

    changeRound(roundItem: MiniKenoProVietRoundItem) {
        this.resetDataAndUI();
        this.timeHandler.stopPlayTime();
        this.sendData({ getPlayerBets: true, roundId: roundItem.round.id, get_time: true });
        this.roundId = parseInt(roundItem.round.id);
        this.setGameRound(this.roundId);

        if (!this.isIncomingGameRound) {
            this.timeWaitNode.active = true;
            this.timeWaitLabel.string = roundItem.fullDate + " " + roundItem.roundTime.string;
        }
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

    protected sendBet(betAmount, betChoice) {
        this.bet({ bet: { amount: betAmount, betChoice: betChoice, roundId: this.roundId } });
    }

    protected isDisabledBet(): boolean {
        return super.isDisabledBet() && this.isIncomingGameRound;
    }
}
