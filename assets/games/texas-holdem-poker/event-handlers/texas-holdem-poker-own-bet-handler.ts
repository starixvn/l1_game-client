import { CardModel } from "../texas-type";
import { cloneDeep } from "lodash";
import TexasHoldemPokerGameData from "../event-models/texas-holdem-poker-game-data";
import TexasHoldemPokerEventHandler from "./texas-holdem-poker-event-handler";
import { cloneDeepChoiceData } from "../texas-helper";

export type TexasHoldemPokerOwnBetType = {
    ownBets: {
        roundId: number;
        bets: Record<string, number>;
        player: CardModel[];
        communityCards: CardModel[];
        combinationResult: {
            player: {
                id: number;
                combinationCards: CardModel[];
                cards: CardModel[];
            };
        };
        totalAmount: number;
    };
};

export default class TexasHoldemPokerOwnBetHandler<Choices> extends TexasHoldemPokerEventHandler<TexasHoldemPokerOwnBetType, Choices> {
    protected verifyEvent(event: TexasHoldemPokerOwnBetType) {
        return !!event.ownBets;
    }

    protected handle(event: TexasHoldemPokerOwnBetType) {
        this.gameData.isProcessingBet = false;
        const { bets, combinationResult, communityCards, roundId, player, totalAmount } = event.ownBets;

        if (!bets) {
            return;
        }
        const betsConverted = cloneDeepChoiceData(bets);
        this.gameData.emit(TexasHoldemPokerGameData.Events.CHOICES_RESULT, betsConverted);
        this.gameData.stateModel.rejoinTable(communityCards.length);
        this.gameData.ownBets.changeOwnBets({
            totalAmount: totalAmount,
            combinationResult: combinationResult,
            communityCards: communityCards,
            bets: betsConverted,
            playerCards: player,
            roundId: roundId
        });
    }
}
