import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export default class CascadingUIModel extends EventEmitterBase {
    static Events = {
        CHANGE_TUMBLE_WIN: "ui:change_tumble_win",
        CHANGE_TOTAL_WIN: "ui:change_total_win",
        CHANGE_MULTIPLIER: "ui:change_multiplier",
        CHANGE_TOTAL_MULTIPLIER: "ui:change_total_multiplier",
        RESET_TUMBLE: "ui:reset_tumble_win"
    };

    totalTumbleWin = 0;
    totalWin = 0;
    multiplier = 0;
    totalMultiplier = 0;

    resetTumbleWin() {
        this.totalTumbleWin = 0;
        this.totalWin = 0;
        this.multiplier = 0;

        this.emit(CascadingUIModel.Events.RESET_TUMBLE, this);
    }

    increaseTumbleWin(value: number) {
        this.totalTumbleWin += value;
        this.emit(CascadingUIModel.Events.CHANGE_TUMBLE_WIN, this.totalTumbleWin);
    }

    increaseTotalWin(value: number) {
        this.totalWin += value;
        this.emit(CascadingUIModel.Events.CHANGE_TOTAL_WIN, this.totalWin);
    }

    increaseMultiplier(value: number) {
        this.multiplier += value;
        this.emit(CascadingUIModel.Events.CHANGE_MULTIPLIER, this.multiplier);
    }

    changeTotalMultiplier(value: number) {
        this.totalMultiplier = value;
        this.emit(CascadingUIModel.Events.CHANGE_TOTAL_MULTIPLIER, this.totalMultiplier);
    }
}
