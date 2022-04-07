import TexasGameDataModel from "../event-models/texas-game-data-model";
import { cloneDeepChoiceData } from "../texas-helper";
import { CardModel } from "../texas-type";
import TexasEventHandler from "./texas-event-handler";

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
        hasSwappedOrHold: boolean;
    };
};

export default class TexasOwnBetHandler<Choices> extends TexasEventHandler<TexasHoldemPokerOwnBetType, Choices> {
    protected verifyEvent(event: TexasHoldemPokerOwnBetType) {
        return !!event.ownBets;
    }

    protected handle(event: TexasHoldemPokerOwnBetType) {
        this.gameData.isProcessingBet = false;
        const { bets, combinationResult, communityCards, roundId, player, totalAmount, hasSwappedOrHold } = event.ownBets;

        if (!bets) {
            this.gameData.ownBets.receiveEmpty();
            return;
        }
        const betsConverted = cloneDeepChoiceData(bets);
        this.gameData.ownBets.updateRoundId(roundId);
        this.gameData.emit(TexasGameDataModel.Events.CHOICES_RESULT, betsConverted);
        this.gameData.stateModel.rejoinTable(communityCards.length, hasSwappedOrHold);
        this.gameData.ownBets.changeOwnBets({
            totalAmount: totalAmount,
            combinationResult: combinationResult,
            communityCards: communityCards,
            bets: betsConverted,
            playerCards: player,
            roundId: roundId,
            hasSwappedOrHold: hasSwappedOrHold
        });
    }
}
