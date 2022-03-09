import { HoldemPokerPlaceBetModel } from "../../holdem-poker/event-models/HoldemPokerPlaceBetModel";
import TexasHoldemPokerChoices from "./texas-holdem-poker-choices";
import { TexasHoldemPokerChoicesConst } from "../texas-contants";

export default class TexasHoldemPokerPlaceBetModel extends HoldemPokerPlaceBetModel {
    constructor() {
        super();
        this.setMaxListeners(0);
        this.choices = new TexasHoldemPokerChoices();
        this.previousChoices = new TexasHoldemPokerChoices();
    }

    doubleAndCall() {
        this.choices[TexasHoldemPokerChoicesConst.callBet] = this.choices[TexasHoldemPokerChoicesConst.anteBet] * 2;
        this.emit(TexasHoldemPokerPlaceBetModel.Events.CALL, this);
        this.emit(TexasHoldemPokerPlaceBetModel.Events.UPDATE_CHIPS, {
            choice: TexasHoldemPokerChoicesConst.callBet,
            totalAmount: this.choices[TexasHoldemPokerChoicesConst.callBet]
        });
    }

    updateBetModel(betChoice: string, betEvent: string, choiceRef = TexasHoldemPokerChoicesConst.anteBet, rate = 1) {
        if (rate <= 0) {
            console.log("rete must > 0");
            return;
        }
        const betValue = this.choices[choiceRef] * rate;
        this.choices[betChoice] = betValue;
        this.emit(betEvent, this);
        this.emit(TexasHoldemPokerPlaceBetModel.Events.UPDATE_CHIPS, {
            choice: betChoice,
            totalAmount: betValue
        });
    }

    updateTotalBet(props: { totalBet: number; choice: any }) {
        for (const [key, value] of Object.entries(props.choice)) {
            this.choices[key] = value;
            this.emit(TexasHoldemPokerPlaceBetModel.Events.UPDATE_CHIPS, {
                choice: key,
                totalAmount: value
            });
        }

        this.emit(TexasHoldemPokerPlaceBetModel.Events.PLACE_BET, this);
    }

    updateBetsInfo: (choices) => void;
}
