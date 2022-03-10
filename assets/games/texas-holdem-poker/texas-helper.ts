import TexasHoldemPokerChoices from "./event-models/texas-holdem-poker-choices";
import { cloneDeep } from "lodash";

type Choices = {
    ante?: number;
    call?: number;
    turn?: number;
    river?: number;
};

export const convertChoices = (inputChoices: Choices) => {
    const choices = new TexasHoldemPokerChoices();
    if (inputChoices.ante) {
        choices.anteBet = inputChoices.ante;
    }

    if (inputChoices.call) {
        choices.callBet = inputChoices.call;
    }

    if (inputChoices.turn) {
        choices.turnBet = inputChoices.turn;
    }

    if (inputChoices.river) {
        choices.turnBet = inputChoices.river;
    }

    return choices;
};

export const cloneDeepChoiceData = (data: Record<string, number>) => {
    const result: any = {};
    if (data["ante"]) {
        result["anteBet"] = cloneDeep(data["ante"]);
    }
    if (data["call"]) {
        result["callBet"] = cloneDeep(data["call"]);
    }
    if (data["river"]) {
        result["riverBet"] = cloneDeep(data["river"]);
    }
    if (data["turn"]) {
        result["turnBet"] = cloneDeep(data["turn"]);
    }
    return result;
};
