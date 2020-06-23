import MiniKeno from "../../mini-keno/view-models/MiniKeno";
import MiniKenoProVietConfig from "./MiniKenoProVietConfig";
import MiniKenoProVietRoundsSelection, { MiniKenoProVietRound } from "./components/MiniKenoProVietRoundsSelection";
import MiniKenoProVietRoundsHandler from "./handlers/MiniKenoProVietRoundsHandler";
import MiniKenoProVietTimeHandler from "./handlers/MiniKenoProVietTimeHandler";
import MiniKenoProVietRoundItem from "./components/MiniKenoProVietRoundItem";
import * as moment from "moment";
import { zeroPad } from '../../../common/helpers/Helper.js';
import MiniKenoProVietFinishHandler from "./handlers/MiniKenoProVietFinishHandler";
import MiniKenoProVietUMHandler from "./handlers/MiniKenoProVietUMHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoProViet extends MiniKeno {
    @property(cc.Prefab)
    roundsSelectionPrefab: cc.Prefab = null;

    @property(cc.Label)
    stopBetMessage: cc.Label = null;

    static readonly TIME_FORMAT = "HH:mm";
    static readonly DATE_FORMAT = "DD/MM";
    static readonly FULL_DATE_FORMAT = "DD/MM/YYYY";
    static readonly DATETIME_FORMAT = "DD/MM HH:mm";
    static readonly STOPBET_MESSAGE: string = "Kỳ vé #$ROUND đã ngưng nhận cược.";

    roundsHandler: MiniKenoProVietRoundsHandler;
    rounds: MiniKenoProVietRound[];
    roundsSelection: MiniKenoProVietRoundsSelection;
    roundEndTime: Date;
    isIncomingGameRound: boolean = true;

    onLoad() {
        super.onLoad();
        this.config = new MiniKenoProVietConfig();
        this.addHandlers(this.roundsHandler)
        this.kenoTimer.init(true);
    }

    startGame() {
        super.startGame();

        // Reset game round
        this.roundEndTime = null;
        this.currentTimeRemaining = this.config.betTime;
        this.isIncomingGameRound = true;
    }

    initHandlers() {
        super.initHandlers();

        this.umHandler = new MiniKenoProVietUMHandler(this)
        this.finishHandler = new MiniKenoProVietFinishHandler(this);
        this.roundsHandler = new MiniKenoProVietRoundsHandler(this);
        this.timeHandler = new MiniKenoProVietTimeHandler(this);
    }

    showGameRoundsDialog() {
        cc.RedT.audio.playClick();

        if (this.roundsSelection && this.roundsSelection.node.active) {
            const dialog = this.roundsSelection.getComponent("CommonDialog");
            dialog.closeDialog();
            return;
        }

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
        this.animatedTime.node.active = true;
        this.animatedTime.resetTime();
        this.betBoard.node.active = false;
        this.roundsSelection && (this.roundsSelection.node.active = false);
    }

    changeRound(roundItem: MiniKenoProVietRoundItem) {
        const newRoundId = parseInt(roundItem.round.id);

        if (newRoundId == this.roundId) {
            return;
        }

        const direction = this.roundId < newRoundId ? "right" : "left";

        this.node.parent.runAction(cc.sequence(
            cc.delayTime(0.51),
            cc.callFunc(() => {
                this.slideTransition(this.node, direction, 0.4, (tempNode) => {
                    tempNode.removeComponent(MiniKenoProViet);
                    this.initGameRound(newRoundId, new Date(roundItem.round.time));
                });
            })
        ))
    }

    getPlayerBetsAndTimeOfRound(roundId: string) {
        this.sendData({ getPlayerBets: true, roundId: roundId, get_time: true });
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

    setGameRound(gameRoundId) {
        if (gameRoundId && this.rounds) {
            const formatedRoundId = zeroPad(gameRoundId, 7);
            this.stopBetMessage.string = MiniKenoProViet.STOPBET_MESSAGE.replace("$ROUND", formatedRoundId);
            const currentRound = this.rounds.find(round => round.id === gameRoundId);

            if (currentRound) {
                this.gameRound.string = `#${formatedRoundId} - ${moment(currentRound.time).format(MiniKenoProViet.DATETIME_FORMAT)}`;
            }
        }
    }

    protected registerViewGame() {
        super.registerViewGame();
        this.getGameRounds();
    }

    protected sendBet(betAmount, betChoice) {
        this.bet({ bet: { amount: betAmount, betChoice: betChoice, roundId: this.roundId } });
    }

    protected isDisabledBet(): boolean {
        return super.isDisabledBet() && this.isIncomingGameRound;
    }

    private initGameRound(roundId: number, roundTime: Date) {
        this.resetDataAndUI();
        this.timeHandler.stopPlayTime();
        this.roundId = roundId;
        this.roundEndTime = roundTime;
        this.setGameRound(this.roundId);
        this.getPlayerBetsAndTimeOfRound(roundId.toString());
        this.isIncomingGameRound = this.roundId === this.currentDataLogs[0].roundId + 1;
    }
}
