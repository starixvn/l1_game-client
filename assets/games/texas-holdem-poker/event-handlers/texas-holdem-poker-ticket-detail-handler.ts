import { CardModel } from './../texas-type';
import HoldemPokerTicketDetailEventHandler from "../../holdem-poker/event-handlers/HoldemPokerTicketDetailHandler";

export type TexasTicketDetail = {
    ticketDetail: {
        bets: any;
        dealer: {
            handId: number;
            combination:  CardModel[];
            cards:  CardModel[];
            isQualified: boolean;
        };
        player: {
            handId: number;
            combination:  CardModel[];
            cards:  CardModel[];
        };
        communityCards:  CardModel[];
        isFold: boolean;
        isPlayerWin: number;
    };
};

export default class TexasTicketDetailEventHandler<Choices> extends HoldemPokerTicketDetailEventHandler<Choices> {
    protected verifyEvent(event: TexasTicketDetail) {
        return !!event.ticketDetail;
    }

    protected handle(event: TexasTicketDetail) {
        super.handle(event);
    }
}
