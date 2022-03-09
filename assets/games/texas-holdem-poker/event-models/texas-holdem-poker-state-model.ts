import { EventEmitter } from "events";
import { cloneDeep } from "lodash";

import { TexasHoldemPokerState } from "../texas-type";
import { TexasPokerMaxBetChoices } from "../texas-contants";

export default class TexasHoldemPokerStateModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
        this.state = TexasHoldemPokerState.ante_bet;
        this.previousState = TexasHoldemPokerState.blank_new;
        this.previousRound = false;
    }

    static Events = {
        CHANGE: "change",
        PREPARE_NEW_ROUND: "prepareNewRound",
        FORCE_UPDATE_BALANCE: "forceUpdateBalance"
    };
    previousState: number;
    state: number;
    previousRound: boolean;

    placeBet(choice) {
        if (choice === TexasPokerMaxBetChoices.ante) {
            this.previousState = cloneDeep(this.state);
            this.state = TexasHoldemPokerState.ante_bet;
            this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
        }
    }

    dealing() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.dealing;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    deal() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.calling_deal;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    cancelBet() {
        if (this.previousRound) {
            this.previousState = cloneDeep(this.state);
            this.state = TexasHoldemPokerState.replay_new;
        } else {
            this.previousState = cloneDeep(this.state);
            this.state = TexasHoldemPokerState.blank_new;
        }
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    afterDeal() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.dealt;
        this.previousRound = true;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    call() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.calling_call;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    callSuccess() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.calling_called;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    turning() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.calling_turning;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    checkTurn() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.calling_check_turn;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    turnSuccess() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.calling_turned;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    rivering() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.calling_rivering;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    checkRiver() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.calling_check_river;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    riveSuccess() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.prepare_new;
        this.emit(TexasHoldemPokerStateModel.Events.PREPARE_NEW_ROUND, this);
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    fold() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.calling_fold;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    settle() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.settled;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
        this.previousRound = true;
    }

    resetState() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.blank_new;
        this.previousRound = false;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    replayNew() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.replay_new;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    rebet() {
        this.previousState = cloneDeep(this.state);
        this.state = TexasHoldemPokerState.ante_bet;
        this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
    }

    rejoinTable(communityCardLength: number) {
        switch (communityCardLength) {
            case 4:
                this.turnSuccess();
                break;
            case 3:
                this.callSuccess();
                break;
            case 0:
                this.afterDeal();
                break;
        }
    }

    receiveError(props: any) {
        this.handleUpdateUIState(props);
    }
    private handleUpdateUIState(props) {
        if (!props.apiError) {
            return;
        }
        this.state = cloneDeep(this.previousState);
        setTimeout(() => {
            this.emit(TexasHoldemPokerStateModel.Events.CHANGE, this);
            this.emit(TexasHoldemPokerStateModel.Events.FORCE_UPDATE_BALANCE, this);
        }, 1000);
    }
    clearBet: () => void;
    afterCall: () => void;
    holdemPokerChoiceAnte: (isFullBet: boolean) => void;
    holdemPokerChoiceAA: (isFullBet: boolean) => void;
}
