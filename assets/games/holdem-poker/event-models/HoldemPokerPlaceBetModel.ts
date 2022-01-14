import { EventEmitter } from "events";
import { cloneDeep } from "lodash";

import HoldemPokerChoices, { HoldemPokerChoicesConst } from "./HoldemPokerChoices";

export class HoldemPokerPlaceBetModel extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(0);
        this.choices = new HoldemPokerChoices();
        this.previousChoices = new HoldemPokerChoices();
    }

    static Events = {
        PLACE_BET: "placeBet",
        PLACE_BET_CHIPS: "placeBetChips",
        CLEAR_BET_CHIPS: "clearBetChips",
        CLEAR_ALL_BET_CHIPS: "clearAllBetChips",
        UPDATE_CHIPS: "updateChips",
        UPDATE_ALL_CHIPS: "updateAllChips",
        CLEAR_BETS: "clear",
        DOUBLE: "double",
        CALL: "call",
        DEAL: "deal",
        UPDATE_GAME_ROUND: "updateGameRound",

        TURN: "turn",
        RIVER: "river",
        UPDATE_TOTAL_BET: "updateTotalBet"
    };

    choices: any;
    previousChoices: any;

    placeBet(choice, amount) {
        this.choices[choice] = this.choices[choice] ? this.choices[choice] + amount : amount;
        this.emit(HoldemPokerPlaceBetModel.Events.PLACE_BET, this);
        this.emit(HoldemPokerPlaceBetModel.Events.PLACE_BET_CHIPS, {
            currentChoice: choice,
            currentAmount: amount,
            totalAmount: this.choices[choice]
        });
    }

    double(choice) {
        this.choices[choice] = this.choices[choice] * 2;
        this.emit(HoldemPokerPlaceBetModel.Events.DOUBLE, this);
        this.emit(HoldemPokerPlaceBetModel.Events.UPDATE_CHIPS, {
            choice: choice,
            totalAmount: this.choices[choice]
        });
    }

    resetBets() {
        for (const [key] of Object.entries(this.choices)) {
            this.choices[key] = 0;
        }
        this.emit(HoldemPokerPlaceBetModel.Events.CLEAR_BETS, this);
        this.emit(HoldemPokerPlaceBetModel.Events.CLEAR_ALL_BET_CHIPS, {});
    }

    clear(choice) {
        delete this.choices[choice];
        this.emit(HoldemPokerPlaceBetModel.Events.CLEAR_BETS, this);
        this.emit(HoldemPokerPlaceBetModel.Events.CLEAR_BET_CHIPS, {
            currentChoice: choice
        });
    }

    deal(choices) {
        this.previousChoices = cloneDeep(choices);
        this.emit(HoldemPokerPlaceBetModel.Events.DEAL, this);
    }

    rebet(isReBetAndDeal = true) {
        this.choices = cloneDeep(this.previousChoices);
        this.emit(HoldemPokerPlaceBetModel.Events.PLACE_BET, this);
        this.emit(HoldemPokerPlaceBetModel.Events.UPDATE_GAME_ROUND, this);

        if (isReBetAndDeal) {
            this.emit(HoldemPokerPlaceBetModel.Events.UPDATE_ALL_CHIPS, this);
        } else {
            for (const [key, value] of Object.entries(this.choices)) {
                this.emit(HoldemPokerPlaceBetModel.Events.PLACE_BET_CHIPS, {
                    currentChoice: key,
                    currentAmount: value,
                    totalAmount: value
                });
            }
        }
    }

    rebetAndDeal() {
        this.rebet(true);
    }

    doubleAndCall() {
        this.choices[HoldemPokerChoicesConst.call] = this.choices[HoldemPokerChoicesConst.ante] * 2;
        this.emit(HoldemPokerPlaceBetModel.Events.CALL, this);
        this.emit(HoldemPokerPlaceBetModel.Events.UPDATE_CHIPS, {
            choice: HoldemPokerChoicesConst.call,
            totalAmount: this.choices[HoldemPokerChoicesConst.call]
        });
    }

    rejoinTable(rejoinChoices: any) {
        this.choices = cloneDeep(rejoinChoices);
        this.emit(HoldemPokerPlaceBetModel.Events.CLEAR_ALL_BET_CHIPS, {});
        this.emit(HoldemPokerPlaceBetModel.Events.PLACE_BET, this);
        this.emit(HoldemPokerPlaceBetModel.Events.UPDATE_ALL_CHIPS, this);
    }

    prepareNewRound() {
        for (const [key] of Object.entries(this.choices)) {
            this.choices[key] = 0;
        }
    }

    new() {
        for (const [key] of Object.entries(this.previousChoices)) {
            delete this.previousChoices[key];
        }
        this.emit(HoldemPokerPlaceBetModel.Events.CLEAR_BETS, this);
        this.emit(HoldemPokerPlaceBetModel.Events.UPDATE_GAME_ROUND, {});
    }

    replayNew() {
        this.emit(HoldemPokerPlaceBetModel.Events.CLEAR_BETS, this);
        this.emit(HoldemPokerPlaceBetModel.Events.UPDATE_GAME_ROUND, {});
    }

    updateBetsInfo(choices) {
        for (const [key, value] of Object.entries(choices)) {
            this.choices[key] = value;
            this.emit(HoldemPokerPlaceBetModel.Events.UPDATE_CHIPS, {
                choice: key,
                totalAmount: value
            });
        }

        this.emit(HoldemPokerPlaceBetModel.Events.PLACE_BET, this);
    }
}
