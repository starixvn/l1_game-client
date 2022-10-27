import _ = require("lodash");

import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export class RoundHistory extends EventEmitterBase {
    static Events = {
        FIRST_LOAD: "RoundHistory:FIRST_LOAD",
        WINNING_STREAK: "RoundHistory:WINNING_STREAK",
        CHANGE: "RoundHistory:CHANGE"
    };

    gotIngameData = false;
    roundHistory: any[] = [];
    historySize = 100;
    winningStreak = {};
    private streakChoices = ["big", "small"];
    private readonly consecutiveWinningTimes = 4;
    winningStreakTimeOut;

    get lastRoundId() {
        return this.roundHistory[0]?.roundId || 0;
    }

    setStreakChoices(choices) {
        this.streakChoices = choices;
    }

    add(roundHistory: any) {
        this.winningStreakTimeOut && clearTimeout(this.winningStreakTimeOut);
        this.roundHistory.unshift(roundHistory);
        if (this.roundHistory.length > this.historySize) {
            this.roundHistory.pop();
        }
    }

    checkWinningStreak(roundHistory, waitingTime: number) {
        const { settlementResult } = roundHistory;
        this.winningStreakTimeOut = setTimeout(() => {
            this.streakChoices.forEach((choice) => {
                if (settlementResult[choice]) {
                    this.winningStreak[choice]++;
                } else {
                    this.winningStreak[choice] = 0;
                }

                if (this.winningStreak[choice] >= this.consecutiveWinningTimes) {
                    this.emit(RoundHistory.Events.WINNING_STREAK, { choice, count: this.winningStreak[choice] });
                }
            });
        }, waitingTime * 1000);
    }

    initWinningStreakData() {
        this.streakChoices.forEach((choice) => {
            this.winningStreak[choice] = 0;

            for (const round of this.roundHistory) {
                const { settlementResult } = round;
                if (settlementResult[choice]) {
                    this.winningStreak[choice]++;
                } else {
                    break;
                }
            }
        });
    }

    update() {
        this.roundHistory && this.emit(RoundHistory.Events.CHANGE, this.roundHistory);
    }

    change(roundHistory: any) {
        this.gotIngameData = true;
        this.roundHistory = _.cloneDeep(roundHistory);
        this.initWinningStreakData();
        this.emit(RoundHistory.Events.FIRST_LOAD, this.roundHistory);
        this.emit(RoundHistory.Events.CHANGE, this.roundHistory);
    }

    updateUI() {
        this.emit(RoundHistory.Events.FIRST_LOAD, this.roundHistory);
        this.emit(RoundHistory.Events.CHANGE, this.roundHistory);
    }
}
