import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

type Choices = any;

export class BetModel extends EventEmitterBase {
    static Events = {
        CHANGE_OWN_BET: "BetModel:CHANGE_OWN_BET",
        UPDATE_PREVIOUS_BET: "BetModel:UPDATE_PREVIOUS_BET",
        CHANGE_BET_PERCENTAGE: "BetModel:CHANGE_BET_PERCENTAGE",
        CHANGE_OWN_CHIP: "BetModel:CHANGE_OWN_CHIP",
        CHANGE_PLAYER_CHIP: "BetModel:CHANGE_PLAYER_CHIP",
        CHANGE_TOTAL_CHIPS: "BetModel:CHANGE_TOTAL_CHIPS",
        PLACE_BET_FAILED: "BetModel:PLACE_BET_FAILED",
        PLACE_BET_SUCCESS: "BetModel:PLACE_BET_SUCCESS",
        FLY_OWN_CHIP: "BetModel:FLY_OWN_CHIP",
        CHANGE_OWN_CHIP_FAKE: "BetModel:CHANGE_OWN_CHIP_FAKE"
    };

    ownBets: Choices;
    protected ownChip: any;
    protected playerChip: any;
    protected totalChips: any;
    protected betPercentage: any;

    clearData() {
        this.ownBets = null;
        this.ownChip = null;
        this.playerChip = null;
        this.totalChips = null;
        this.betPercentage = null;
    }

    changeOwnBets(choices: Choices) {
        this.ownBets = choices;
        this.emit(BetModel.Events.CHANGE_OWN_BET, this.ownBets);
        this.emit(BetModel.Events.UPDATE_PREVIOUS_BET, this.ownBets);
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
        this.totalChips && this.emit(BetModel.Events.CHANGE_TOTAL_CHIPS, this.totalChips);
    }

    changePlayerChip(playerChip: any) {
        this.playerChip = playerChip;
        this.emit(BetModel.Events.CHANGE_PLAYER_CHIP, this.playerChip);
    }

    changeTotalChips(totalChips: any) {
        this.totalChips = totalChips;
        this.emit(BetModel.Events.CHANGE_TOTAL_CHIPS, this.totalChips);
    }

    actionFlyOwnChipFake(ownBets) {
        this.emit(BetModel.Events.CHANGE_OWN_CHIP_FAKE, ownBets);
    }

    handleRebet(rebet: any) {
        Object.keys(rebet).forEach((choice) => {
            const chips = rebet[choice];
            Object.keys(chips).forEach((chipValue) => {
                const quantity = chips[chipValue];
                for (let i = 0; i < quantity; i++) {
                    this.changeOwnChip({
                        betChoice: choice,
                        amount: chipValue
                    });
                }
            });
        });
    }
}
