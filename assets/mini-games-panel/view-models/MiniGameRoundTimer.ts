import { lazyInject } from "../../Application";
import GameUtils from "../../common/GameUtils";
import LobbyMenuConfig from "../../lobby/main/view-models/LobbyMenuConfig";
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

    @property
    gameId = 0;

    @property
    resultDelayTime = 0;

    @lazyInject(LobbyMenuConfig)
    private readonly lobbyMenuConfig: LobbyMenuConfig;

    protected betOptions;
    protected gameConfig;
    private countDownTime;
    private roundResult: RoundTimerResult;
    private roundTime: RoundTime;

    onLoad() {
        this.node.active = false;
        this.initRoundTime();
        this.initGameConfig();

        if (this.result) {
            this.roundResult = this.result.getComponent(RoundTimerResult);
            this.roundResult.betOptions = this.betOptions;
        }

        RoundTimerManager.getInstance().roundData && this.onReceivedData(RoundTimerManager.getInstance().roundData);
        uiManager.emitterListener(InternalEvents.RECEIVED_ROUND_TIMER, (data) => this.onReceivedData(data), this);
    }

    async initRoundTime() {
        const prefab = await GameUtils.loadResource(`minipanel/popup-mini-game/RoundTime`);
        const node = cc.instantiate(prefab);
        this.roundTime = node.getComponent(RoundTime);
        this.time.addChild(node);
        this.hideRoundTimer();
        uiManager.emitterListener(InternalEvents.HIDE_POPUP_MINI_GAMES, () => this.hideRoundTimer(), this);
    }

    onDestroy() {
        uiManager.removeListenersWithTarget(this);
    }

    private isStartRound() {
        return this.countDownTime === this.gameConfig.betTime;
    }

    private isInRound() {
        return this.countDownTime <= this.gameConfig.betTime && this.countDownTime >= this.gameConfig.minBetTime;
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
        const gameData = data[this.gameId];

        if (!gameData || !this.lobbyMenuConfig.isRoundTimerGame(this.gameId)) {
            return;
        }

        this.node.active = true;

        const { timeFromStart } = gameData;
        this.countDownTime = timeFromStart ? this.resumeRoundTimer(timeFromStart) : this.gameConfig.fullTime;
        this.schedule(this.countDown, 1, cc.macro.REPEAT_FOREVER, 0);

        this.time.active = false;
        if (!timeFromStart) {
            await GameUtils.delayTime(this.resultDelayTime);
        }
        this.result.active = true;

        if (timeFromStart && this.isInRound()) {
            this.roundTime && this.roundTime.resetTime();
            this.showCountDownTime();
        }

        this.roundResult.setResult(gameData);
    }

    private resumeRoundTimer(timeFromStart): number {
        return Math.round(this.gameConfig.fullTime - timeFromStart);
    }

    private countDown() {
        if (this.countDownTime < this.gameConfig.minBetTime) {
            this.roundTime.resetTime();
            this.time.active = false;
            this.unschedule(this.countDown);
            return;
        }

        this.isStartRound() && this.showCountDownTime();
        this.isInRound() && this.roundTime.setTime(this.countDownTime);
        this.countDownTime--;
    }

    initGameConfig() {
        // override
    }
}
