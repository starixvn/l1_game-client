import GameUtils from "../../common/GameUtils";
import { getGameConfiguration } from "../../configs/GameConfigurations";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";
import RoundTime from "./RoundTime";
import RoundTimerManager from "./RoundTimerManager";
import RoundTimerResult from "./RoundTimerResult";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniGameRoundTimer extends cc.Component {
    @property(cc.Node)
    result: cc.Node = null;

    @property(cc.Node)
    time: cc.Node = null;

    @property(cc.Prefab)
    roundTimePrefb: cc.Prefab = null;

    @property
    gameId = 0;

    @property
    resultDelayTime = 0;

    protected betOptions;
    protected gameConfig;
    private counDownTimer;
    private roundResult: RoundTimerResult;
    roundTime: RoundTime = null;

    onLoad() {
        this.initRoundTime();
        this.hideRoundTimer();
        this.initGameConfig();

        if (this.result) {
            this.roundResult = this.result.getComponent(RoundTimerResult);
            this.roundResult.betOptions = this.betOptions;
        }

        RoundTimerManager.getInstance().roundData && this.onReceivedData(RoundTimerManager.getInstance().roundData);

        uiManager.emitterListener(InternalEvents.MINI_GAME_ROUND_TIMER, (data) => this.onReceivedData(data), this);
        uiManager.emitterListener(InternalEvents.HIDE_POPUP_MINI_GAMES, () => this.hideRoundTimer(), this);
    }

    initRoundTime() {
        const node = cc.instantiate(this.roundTimePrefb);
        this.roundTime = node.getComponent(RoundTime);
        this.time.addChild(node);
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
        this.time.active = false;
    }

    showCountDownTime() {
        this.time.active = true;
        this.result.active = false;
    }

    private async onReceivedData(data) {
        const gameConfiguration = getGameConfiguration(this.gameId);
        const gameData = data[gameConfiguration.key.toLowerCase()];

        if (!gameData) {
            return;
        }

        const { timeFromStart } = gameData;

        this.time.active = false;
        !timeFromStart && (await GameUtils.delayTime(this.resultDelayTime));
        this.result.active = true;

        this.roundResult.setResult(gameData);

        this.counDownTimer = timeFromStart ? this.resumeRoundTimer(timeFromStart) : this.gameConfig.fullTime;
        if (timeFromStart && this.isInRound()) {
            this.roundTime.resetTime();
            this.showCountDownTime();
        }
        this.schedule(this.countDown, 1, cc.macro.REPEAT_FOREVER, 0);
    }

    private resumeRoundTimer(timeFromStart): number {
        return Math.round(this.gameConfig.fullTime + timeFromStart);
    }

    private countDown() {
        if (this.counDownTimer < this.gameConfig.minBetTime) {
            this.roundTime.resetTime();
            this.time.active = false;
            this.unschedule(this.countDown);
            return;
        }

        this.isStartRound() && this.showCountDownTime();
        this.isInRound() && this.roundTime.setTime(this.counDownTimer);
        this.counDownTimer--;
    }

    initGameConfig() {
        // override
    }
}
