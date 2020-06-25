import MiniKeno from "../../mini-keno/view-models/MiniKeno";
import MiniKenoProVietConfig from "./MiniKenoProVietConfig";
import MiniKenoProVietRoundsSelection, { MiniKenoProVietRound } from "./components/MiniKenoProVietRoundsSelection";
import MiniKenoProVietRoundsHandler from "./handlers/MiniKenoProVietRoundsHandler";
import MiniKenoProVietTimeHandler from "./handlers/MiniKenoProVietTimeHandler";
import * as moment from "moment";
import { zeroPad } from '../../../common/helpers/Helper.js';
import MiniKenoProVietFinishHandler from "./handlers/MiniKenoProVietFinishHandler";
import MiniKenoProVietUMHandler from "./handlers/MiniKenoProVietUMHandler";
import * as config from '../../../Configs.js';

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoProViet extends MiniKeno {
    @property(cc.Prefab)
    roundsSelectionPrefab: cc.Prefab = null;

    @property(cc.RichText)
    stopBetMessage: cc.RichText = null;

    static readonly TIME_FORMAT = "HH:mm";
    static readonly DATE_FORMAT = "DD/MM";
    static readonly FULL_DATE_FORMAT = "DD/MM/YYYY";
    static readonly DATETIME_FORMAT = "DD/MM HH:mm";
    static readonly STOP_BET_MESSAGE = "Kỳ vé $ROUND đã dừng nhận cược. \nVui lòng chọn kỳ vé khác."

    roundsHandler: MiniKenoProVietRoundsHandler;
    rounds: MiniKenoProVietRound[];
    roundsSelection: MiniKenoProVietRoundsSelection;
    roundEndTime: Date;
    isIncomingGameRound: boolean = true;

    public onLoad() {
        super.onLoad();
        this.config = new MiniKenoProVietConfig();
        this.addHandlers(this.roundsHandler)
        this.kenoTimer.init(true);
    }

    public startGame() {
        super.startGame();

        // Reset game round
        this.roundEndTime = null;
        this.currentTimeRemaining = this.config.betTime;
        this.isIncomingGameRound = true;
    }

    public initHandlers() {
        super.initHandlers();

        this.umHandler = new MiniKenoProVietUMHandler(this)
        this.finishHandler = new MiniKenoProVietFinishHandler(this);
        this.roundsHandler = new MiniKenoProVietRoundsHandler(this);
        this.timeHandler = new MiniKenoProVietTimeHandler(this);
    }

    public onClickTitle() {
        MiniKenoProViet.openVietlottUrl();
    }

    public static openVietlottUrl() {
        window.open(config.kenoVietLotUrl, '_blank');
        window.focus();
    }

    public showGameRoundsDialog() {
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

    public selectNextRound() {
        cc.RedT.audio.playClick();
        const nextRoundId = this.roundId + 1;
        const round = this.rounds.find(r => r.id === nextRoundId);
        this.changeRound(round, 0);
    }

    public getGameRounds() {
        this.sendData({ "getRounds": true });
    }

    public resetDataAndUI() {
        super.resetDataAndUI();

        this.stopBetWarning.active = false;
        this.animatedTime.node.active = true;
        this.animatedTime.resetTime();
        this.betBoard.node.active = false;
        this.roundsSelection && (this.roundsSelection.node.active = false);
    }

    public changeRound(round: MiniKenoProVietRound, delayTime: number = 0.51) {
        const newRoundId = round.id;

        if (newRoundId == this.roundId) {
            return;
        }

        const direction = this.roundId < newRoundId ? "right" : "left";

        this.node.parent.runAction(cc.sequence(
            cc.delayTime(delayTime),
            cc.callFunc(() => {
                this.slideTransition(this.node, direction, 0.4, (tempNode) => {
                    tempNode.removeComponent(MiniKenoProViet);
                    this.initGameRound(newRoundId, new Date(round.time));
                });
            })
        ))
    }

    public getPlayerBetsAndTimeOfRound(roundId: string) {
        this.sendData({ getPlayerBets: true, roundId: roundId, get_time: true });
    }

    public initRoundSelectionPopup(): MiniKenoProVietRoundsSelection {
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

    public setGameRound(gameRoundId) {
        if (gameRoundId && this.rounds) {
            const formatedRoundId = this.formatGameRound(gameRoundId);
            this.stopBetMessage.string = MiniKenoProViet.STOP_BET_MESSAGE.replace("$ROUND", formatedRoundId);
            const currentRound = this.rounds.find(round => round.id === gameRoundId);

            if (currentRound) {
                this.gameRound.string = `${formatedRoundId} - ${moment(currentRound.time).format(MiniKenoProViet.TIME_FORMAT)}`;
            }
        }
    }

    public highlightWonItem(results: any = null, isAnimated = true) {
        super.highlightWonItem(results, isAnimated && this.isIncomingGameRound);
    }

    public static formatGameRound(roundId: number) {
        return `${zeroPad(roundId, 7)}`;
    }

    protected formatGameRound(roundId: number) {
        return `#${MiniKenoProViet.formatGameRound(roundId)}`;
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
