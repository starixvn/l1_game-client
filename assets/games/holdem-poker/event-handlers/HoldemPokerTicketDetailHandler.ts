import { HoldemPokerCardModel } from "../event-models/HoldemPokerCardModel";
import { HandTicketDetail } from "../event-models/HoldemPokerCombinationResult";
import HoldemPokerEventHandler from "./HoldemPokerEventHandler";

export type HoldemPokerTicketDetail<Choices> = {
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
        isSwappedOrHold?: boolean;
    };
};

export default class HoldemPokerTicketDetailEventHandler<Choices> extends HoldemPokerEventHandler<
    HoldemPokerTicketDetail<Choices>,
    Choices
> {
    protected verifyEvent(event: HoldemPokerTicketDetail<Choices>) {
        return !!event.ticketDetail;
    }

    protected handle(event: HoldemPokerTicketDetail<Choices>) {
        const { player, isFold, bets, dealer, isPlayerWin, isSwappedOrHold } = event.ticketDetail;
        const playerCards = new HandTicketDetail();
        playerCards.handResultId = player.handId;
        playerCards.cards = player.cards.map((c) => new HoldemPokerCardModel(c.rank, c.suit));
        playerCards.combinationCards = player.combination.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

        const dealerCards = new HandTicketDetail();
        if (!isFold) {
            dealerCards.cards = dealer.cards.map((c) => new HoldemPokerCardModel(c.rank, c.suit));
            dealerCards.combinationCards = dealer.combination.map((c) => new HoldemPokerCardModel(c.rank, c.suit));
            dealerCards.handResultId = dealer.handId;
            dealerCards.isQualified = dealer.isQualified;
        }

        const communityCards = event.ticketDetail.communityCards.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

        this.gameData.ticketDetailModel.changeTicketDetail({
            dealerCards,
            communityCards,
            playerCards,
            bets,
            isFold,
            isPlayerWin,
            isSwappedOrHold
        });
    }
}
