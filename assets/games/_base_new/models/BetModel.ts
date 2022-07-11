import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

type Choices = any;

export class BetModel extends EventEmitterBase {
    static Events = {
        CHANGE_OWN_BET: "BetModel:CHANGE_OWN_BET",
        CHANGE_OWN_CHIP: "BetModel:CHANGE_OWN_CHIP",
        PLACE_BET_FAILED: "BetModel:PLACE_BET_FAILED",
        PLACE_BET_SUCCESS: "BetModel:PLACE_BET_SUCCESS"
    };

    protected ownBets: Choices;
    protected ownChip: any;

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

    updateUI() {
        this.ownBets && this.emit(BetModel.Events.CHANGE_OWN_BET, this.ownBets);
        this.ownChip && this.emit(BetModel.Events.CHANGE_OWN_CHIP, this.ownChip);
    }
}
