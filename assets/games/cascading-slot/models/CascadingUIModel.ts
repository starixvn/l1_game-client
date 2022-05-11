import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export default class CascadingUIModel extends EventEmitterBase {
    static Events = {
        CHANGE_TUMBLE_WIN: "ui:change_tumble_win",
        CHANGE_TOTAL_WIN: "ui:change_total_win"
    };

    totalTumbleWin = 0;
    totalWin = 0;

    increaseTumbleWin(value: number) {
        this.totalTumbleWin += value;
        this.emit(CascadingUIModel.Events.CHANGE_TUMBLE_WIN, this.totalTumbleWin);
    }

    increaseTotalWin(value: number) {
        this.totalWin += value;
        this.emit(CascadingUIModel.Events.CHANGE_TOTAL_WIN, this.totalWin);
    }
}
