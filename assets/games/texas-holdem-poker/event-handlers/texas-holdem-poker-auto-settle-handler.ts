import TexasHoldemPokerHandler from "./texas-holdem-poker-event-handler";

export type TexasHoldemAutoSettle = {
  autoSettle: {
    dealer: Array<Record<string, number>>;
    communityCards: Array<Record<string, number>>;
    combinationResult: {
      player: {
        id: number;
        combinationCards: Array<Record<string, number>>;
        cards: Array<Record<string, number>>;
      };
      dealer: {
        id: number;
        combinationCards: Array<Record<string, number>>;
        cards: Array<Record<string, number>>;
      };
    };
    totalAmount: number;
    step: string;
  };
};

export default class TexasHoldemAutoSettleEventHandler<Choices> extends TexasHoldemPokerHandler<TexasHoldemAutoSettle, Choices> {
  protected verifyEvent(event: TexasHoldemAutoSettle) {
    return !!event.autoSettle;
  }

  protected handle(event: TexasHoldemAutoSettle) {
    this.gameData.isProcessingBet = false;
    const { communityCards, combinationResult, totalAmount, dealer, step } = event.autoSettle;
    
    const convertedDealerCard = dealer.map((e) => {
      return { rank: e.rank, suit: e.suit };
    });

    const convertedCommunityCards = communityCards.map((e) => {
      return { rank: e.rank, suit: e.suit };
    });

    this.gameData.autoSettleModel.updateModel({
      combinationResult: combinationResult,
      totalAmount: totalAmount,
      step: step,
      dealerCards: convertedDealerCard,
      communityCards: convertedCommunityCards,
    });
    this.gameData.settlement.waiting = this.gameData.settlement.autoSettle = true;
  }
}
