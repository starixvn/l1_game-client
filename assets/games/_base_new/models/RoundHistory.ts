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
    streakChoices = ["big", "small"];

    get lastRoundId() {
        return this.roundHistory[0]?.roundId || 0;
    }

    add(roundHistory: any) {
        this.roundHistory.unshift(roundHistory);
        if (this.roundHistory.length > this.historySize) {
            this.roundHistory.pop();
        }
        this.checkWinningStreak(roundHistory);
    }

    checkWinningStreak(roundHistory) {
        const { settlementResult } = roundHistory;
        this.streakChoices.forEach((choice) => {
            if (settlementResult[choice]) {
                this.streakChoices[choice]++;
            } else {
                this.streakChoices[choice] = 0;
            }

            if (this.streakChoices[choice] >= 4) {
                this.emit(RoundHistory.Events.WINNING_STREAK, { choice, count: this.streakChoices[choice] });
            }
        });
    }

    initWinningStreakData() {
        this.streakChoices.forEach((choice) => {
            this.streakChoices[choice] = 0;
            for (let i = 0; i < this.roundHistory.length; i++) {
                const { settlementResult } = this.roundHistory[i];
                if (settlementResult[choice]) {
                    this.streakChoices[choice]++;
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
