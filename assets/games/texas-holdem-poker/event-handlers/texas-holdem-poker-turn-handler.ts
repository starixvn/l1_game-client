import { CardModel } from './../texas-type';
import TexasHoldemPokerEventHandler from "./texas-holdem-poker-event-handler";
import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";

export type TexasHoldemTurn<Choices> = {
  turn: {
    player:  CardModel[];
    communityCards:  CardModel[];
    combinationResult: {
      player: {
        id: number;
        combinationCards:  CardModel[];
        cards:  CardModel[];
      };
    };
    choices: Record<string, number>;
    roundId: number;
    totalAmount: number;
  };
};

export default class TexasHoldemCallEventHandler<Choices> extends TexasHoldemPokerEventHandler<TexasHoldemTurn<Choices>, Choices> {
  protected verifyEvent(event: TexasHoldemTurn<Choices>) {
    return !!event.turn;
  }

  protected handle(event: TexasHoldemTurn<Choices>) {
    const { communityCards, combinationResult, totalAmount } = event.turn;

    const convertedCommunityCards = communityCards.map((e) => {
      return { rank: e.rank, suit: e.suit };
    });

    const choices = new TexasHoldemPokerChoices();
    choices.anteBet = event.turn.choices.ante;
    choices.callBet = event.turn.choices.call;
    choices.turnBet = event.turn.choices.turn;

    this.gameData.placeBetModel.updateTotalBet({ totalBet: totalAmount, choice: choices });
    this.gameData.turnModel.updateModel(convertedCommunityCards, combinationResult, totalAmount);
  }
}
