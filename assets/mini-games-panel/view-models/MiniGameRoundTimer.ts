import AnimatedTime from "../../common/animated-time/view-models/AnimatedTime";
import GameUtils from "../../common/GameUtils";
import { numberPad } from "../../common/helpers/NumberHelper";
import { getGameConfiguration } from "../../configs/GameConfigurations";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";
import RoundTimerManager from "./RoundTimerManager";
import RoundTimerResult from "./RoundTimerResult";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniGameRoundTimer extends cc.Component {
    @property(cc.Node)
    result: cc.Node = null;

    @property(AnimatedTime)
    timer: AnimatedTime = null;

    @property
    gameId = 0;

    @property
    resultDelayTime = 0;

    protected betOptions;
    protected gameConfig;
    private counDownTimer;
    private roundResult: RoundTimerResult;
    private timerContainer: cc.Node;

    onLoad() {
        this.timerContainer = this.timer.node.parent;
        this.hideRoundTimer();
        this.initGameConfig();
        this.timer.setAnimatedY(5, 0);

        if (this.result) {
            this.roundResult = this.result.getComponent(RoundTimerResult);
            this.roundResult.betOptions = this.betOptions;
        }

        RoundTimerManager.getInstance().roundData && this.onReceivedData(RoundTimerManager.getInstance().roundData);

        uiManager.emitterListener(InternalEvents.MINI_GAME_ROUND_TIMER, (data) => this.onReceivedData(data), this);
        uiManager.emitterListener(InternalEvents.HIDE_POPUP_MINI_GAMES, () => this.hideRoundTimer(), this);
    }

    onDestroy() {
        uiManager.removeListenersWithTarget(this);
    }

    private isStartRound() {
        return this.counDownTimer === this.gameConfig.betTime;
    }

    private isInRound() {
        return this.counDownTimer <= this.gameConfig.betTime && this.counDownTimer >= this.gameConfig.minBetTime;
    }

    hideRoundTimer() {
        this.result.active = false;
        this.timerContainer.active = false;
    }

    showCountDownTime() {
        this.timerContainer.active = true;
        this.result.active = false;
    }

    private async onReceivedData(data) {
        const gameConfiguration = getGameConfiguration(this.gameId);
        const gameData = data[gameConfiguration.key.toLowerCase()];

        if (!gameData) {
            return;
        }

        const { settlementResult, timeFromStart } = gameData;
        this.timerContainer.active = false;
        !timeFromStart && (await GameUtils.delayTime(this.resultDelayTime));
        this.result.active = true;

        const settlement = settlementResult;
        this.roundResult.setResult(settlement);

        this.counDownTimer = timeFromStart ? this.resumeRoundTimer(timeFromStart) : this.gameConfig.fullTime;
        if (timeFromStart && this.isInRound()) {
            this.timer.setTime(``);
            this.showCountDownTime();
        }
        this.schedule(this.countDown, 1, cc.macro.REPEAT_FOREVER, 0);
    }

    private resumeRoundTimer(timeFromStart): number {
        return Math.round(this.gameConfig.fullTime + timeFromStart);
    }

    private countDown() {
        if (this.counDownTimer < this.gameConfig.minBetTime) {
            this.timer.setTime(``);
            this.timerContainer.active = false;
            this.unschedule(this.countDown);
            return;
        }

        this.isStartRound() && this.showCountDownTime();
        this.isInRound() && this.timer.setTime(`${numberPad(this.counDownTimer, 2)}`);
        this.counDownTimer--;
    }

    initGameConfig() {
        // override
    }
}
