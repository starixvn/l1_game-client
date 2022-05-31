import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export default class CascadingUIModel extends EventEmitterBase {
    static Events = {
        CHANGE_TUMBLE_WIN: "ui:change_tumble_win",
        CHANGE_TOTAL_WIN: "ui:change_total_win",
        CHANGE_MULTIPLIER: "ui:change_multiplier",
        CHANGE_TOTAL_MULTIPLIER: "ui:change_total_multiplier",

        SET_FREESPINS: "ui:set_freespins",
        INCREASE_FREESPINS: "ui:increase_frespins",

        CHANGE_TOTAL_BET: "ui:change_total_bet",

        RESET_NEW_ROUND: "ui:reset_new_round",

        GET_MULTIPLIER: "ui:get_multiplier"
    };

    totalTumbleWin = 0;
    totalWin = 0;
    multiplier = 0;

    totalMultiplier = 0;

    freeSpins = 0;

    resetNewRound() {
        this.totalTumbleWin = 0;
        this.totalWin = 0;
        this.multiplier = 0;

        this.emit(CascadingUIModel.Events.RESET_NEW_ROUND, this);
    }

    increaseTumbleWin(value: number) {
        this.totalTumbleWin += value;
        this.emit(CascadingUIModel.Events.CHANGE_TUMBLE_WIN, this.totalTumbleWin);
    }

    increaseTotalWin(value: number) {
        this.totalWin += value;
        this.emit(CascadingUIModel.Events.CHANGE_TOTAL_WIN, this.totalWin);
    }

    setTotalWin(value: number) {
        this.totalWin = value;
        this.emit(CascadingUIModel.Events.CHANGE_TOTAL_WIN, this.totalWin);
    }

    getMultiplier() {
        this.emit(CascadingUIModel.Events.GET_MULTIPLIER);
    }

    increaseMultiplier(value: number) {
        this.multiplier += value;
        this.emit(CascadingUIModel.Events.CHANGE_MULTIPLIER, this.multiplier);
    }

    changeTotalMultiplier(value: number) {
        this.totalMultiplier = value;
        this.emit(CascadingUIModel.Events.CHANGE_TOTAL_MULTIPLIER, this.totalMultiplier);
    }

    setFreeSpins(value: number) {
        this.freeSpins = value;
        this.emit(CascadingUIModel.Events.SET_FREESPINS, this.freeSpins);
    }

    increaseFrespins(value: number) {
        this.freeSpins += value;
        this.emit(CascadingUIModel.Events.INCREASE_FREESPINS, this.freeSpins);
    }
}
