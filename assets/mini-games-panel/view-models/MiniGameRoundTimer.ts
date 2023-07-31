import GameUtils from "../../common/GameUtils";
import { getGameConfiguration } from "../../configs/GameConfigurations";
import { uiManager } from "../../managers/GameUIManager";
import { InternalEvents } from "../../managers/InternalEvents";
import RoundTimerResult from "./RoundTimerResult";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniGameRoundTimer extends cc.Component {
    @property(cc.Node)
    result: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property
    gameId = 0;

    @property
    resultDelayTime = 0;

    protected betOptions;
    protected gameConfig;
    protected counDownTimer;
    roundResult: RoundTimerResult;

    onLoad() {
        this.initGameConfig();
        if (this.result) {
            this.roundResult = this.result.getComponent(RoundTimerResult);
            this.roundResult.betOptions = this.betOptions;
        }
        this.result.active = false;
        this.time.node.active = false;

        uiManager.emitterListener(
            InternalEvents.MINI_ROUND_TIMER,
            (data) => {
                this.onReceivedData(data);
            },
            this
        );
    }

    private async onReceivedData(data) {
        const gameConfiguration = getGameConfiguration(this.gameId);
        const gameData = data[gameConfiguration.key.toLowerCase()];
        if (!gameData) {
            return;
        }
        this.time.node.active = false;
        await GameUtils.delayTime(this.resultDelayTime);
        this.result.active = true;
        const settlement = gameData["settlementResult"];
        this.setResult(settlement);
        this.counDownTimer = this.gameConfig.fullTime;
        this.schedule(this.countDown, 1, cc.macro.REPEAT_FOREVER, 0);
    }

    private countDown() {
        if (this.counDownTimer < this.gameConfig.minBetTime) {
            this.time.string = "";
            this.time.node.active = false;
            this.unschedule(this.countDown);
            return;
        }

        if (this.isStartRound()) {
            this.time.node.active = true;
            this.result.active = false;
        }

        if (this.isInRound()) {
            this.time.string = this.counDownTimer;
        }

        this.counDownTimer--;
    }

    private isStartRound() {
        return this.counDownTimer === this.gameConfig.betTime;
    }

    private isInRound() {
        return this.counDownTimer <= this.gameConfig.betTime && this.counDownTimer >= this.gameConfig.minBetTime;
    }

    initGameConfig() {
        // override
    }

    setResult(settlement) {
        this.roundResult.setResult(settlement);
    }
}
