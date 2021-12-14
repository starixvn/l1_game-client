import TexasHoldemPokerHandler from "./texas-holdem-poker-event-handler";

export type TexasTicketDetail<Choices> = {
  ticketDetail: {
    bets: any;
    dealer: {
      handId: number;
      combination: Array<Record<string, number>>;
      cards: Array<Record<string, number>>;
      isQualified: boolean;
    };
    player: {
      handId: number;
      combination: Array<Record<string, number>>;
      cards: Array<Record<string, number>>;
    };
    communityCards: Array<Record<string, number>>;
    isFold: boolean;
    isPlayerWin: number;
  };
};

export default class TexasTicketDetailEventHandler<Choices> extends TexasHoldemPokerHandler<TexasTicketDetail<Choices>, Choices> {
  protected verifyEvent(event: TexasTicketDetail<Choices>) {
    return !!event.ticketDetail;
  }

  protected handle(event: TexasTicketDetail<Choices>) {
    this.gameData.ticketDetailModel.changeTicketDetail(event.ticketDetail);
  }
}
