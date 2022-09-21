import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

type Choices = any;

export class BetModel extends EventEmitterBase {
    static Events = {
        CHANGE_OWN_BET: "BetModel:CHANGE_OWN_BET",
        CHANGE_OWN_CHIP: "BetModel:CHANGE_OWN_CHIP",
        CHANGE_BET_PERCENTAGE: "BetModel:CHANGE_BET_PERCENTAGE",
        PLACE_BET_FAILED: "BetModel:PLACE_BET_FAILED",
        PLACE_BET_SUCCESS: "BetModel:PLACE_BET_SUCCESS",
        FLY_OWN_CHIP: "BetModel:FLY_OWN_CHIP",
        UPDATE_TOTAL_CHIP: "BetModel:UPDATE_TOTAL_CHIP",
        CHANGE_OWN_CHIP_FAKE: "BetModel:CHANGE_OWN_CHIP_FAKE"
    };

    ownBets: Choices;
    protected ownChip: any;
    protected betPercentage: any;

    clearData() {
        this.ownBets = null;
        this.betPercentage = null;
    }

    changeOwnBets(choices: Choices) {
        this.ownBets = choices;
        this.emit(BetModel.Events.CHANGE_OWN_BET, this.ownBets);
    }

    placeBetSuccess(endBet: number) {
        this.emit(BetModel.Events.PLACE_BET_SUCCESS, endBet);
    }

    placeBetFailed() {
        this.emit(BetModel.Events.PLACE_BET_FAILED);
    }

    changeOwnChip(ownChip: any) {
        this.ownChip = ownChip;
        this.emit(BetModel.Events.CHANGE_OWN_CHIP, this.ownChip);
    }

    flyOwnChip(ownBet: any) {
        this.emit(BetModel.Events.FLY_OWN_CHIP, ownBet);
    }

    changeBetPercentage(percentage: number) {
        this.betPercentage = percentage;
        this.emit(BetModel.Events.CHANGE_BET_PERCENTAGE, this.betPercentage);
    }

    updateUI() {
        this.ownBets && this.emit(BetModel.Events.CHANGE_OWN_BET, this.ownBets);
        this.ownBets && this.actionFlyOwnChipFake(this.ownBets);
        this.betPercentage && this.emit(BetModel.Events.CHANGE_BET_PERCENTAGE, this.betPercentage);
    }

    updateTotalChips(chips: any) {
        this.emit(BetModel.Events.UPDATE_TOTAL_CHIP, chips);
    }

    actionFlyOwnChipFake(ownBets) {
        this.emit(BetModel.Events.CHANGE_OWN_CHIP_FAKE, ownBets);
    }
}
