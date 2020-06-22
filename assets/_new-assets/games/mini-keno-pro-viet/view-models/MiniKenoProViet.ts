import MiniKeno from "../../mini-keno/view-models/MiniKeno";
import MiniKenoProVietConfig from "./MiniKenoProVietConfig";
import MiniKenoProVietRoundsSelection, { MiniKenoProVietRound } from "./components/MiniKenoProVietRoundsSelection";
import MiniKenoProVietRoundsHandler from "./handlers/MiniKenoProVietRoundsHandler";
import MiniKenoProVietTimeHandler from "./handlers/MiniKenoProVietTimeHandler";
import MiniKenoProVietRoundItem from "./components/MiniKenoProVietRoundItem";
import { GameState } from "../../_base/GameBase";
import * as moment from "moment";
import { zeroPad } from '../../../common/helpers/Helper.js';

const { ccclass, property } = cc._decorator;

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}

@ccclass
export default class MiniKenoProViet extends MiniKeno {
    @property(cc.Prefab)
    roundsSelectionPrefab: cc.Prefab = null;

    @property(cc.Label)
    roundInfo: cc.Label = null;

    static readonly TIME_FORMAT = "HH:mm";
    static readonly DATE_FORMAT = "DD/MM";
    static readonly FULL_DATE_FORMAT = "DD/MM/YYYY";
    static readonly DATETIME_FORMAT = "DD/MM HH:mm";

    roundsHandler: MiniKenoProVietRoundsHandler;
    rounds: MiniKenoProVietRound[];
    roundsSelection: MiniKenoProVietRoundsSelection;
    roundEndTime: Date;

    get isIncomingGameRound(): boolean {
        return !this.currentDataLogs || !this.currentDataLogs[0] || (this.roundId === this.currentDataLogs[0].roundId + 1);
    }

    onLoad() {
        super.onLoad();
        this.config = new MiniKenoProVietConfig();
        this.addHandlers(this.roundsHandler)
        this.kenoTimer.init(true);
    }

    initHandlers() {
        super.initHandlers();

        this.roundsHandler = new MiniKenoProVietRoundsHandler(this);
        this.timeHandler = new MiniKenoProVietTimeHandler(this)
    }

    showGameRoundsDialog() {
        cc.RedT.audio.playClick();

        if (this.gameState == GameState.Stopped) {
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
        this.roundEndTime = null;
    }

    changeRound(roundItem: MiniKenoProVietRoundItem) {
        this.node.parent.runAction(cc.sequence(
            cc.delayTime(0.51),
            cc.callFunc(() => {
                this.playGameRoundTransition(() => {
                    this.resetDataAndUI();
                    this.timeHandler.stopPlayTime();
                    this.roundId = parseInt(roundItem.round.id);
                    this.roundEndTime = new Date(roundItem.round.time);
                    this.setGameRound(this.roundId);
                    this.getPlayerBets(roundItem.round.id);
                });
            })
        ))
    }

    getPlayerBets(roundId: string) {
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
            const currentRound = this.rounds.find(round => round.id === gameRoundId);

            if (currentRound) {
                this.gameRound.string = `#${zeroPad(gameRoundId, 7)} - ${moment(currentRound.time).format(MiniKenoProViet.DATETIME_FORMAT)}`;
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
}
