import TexasHoldemPokerChoices from "../event-models/texas-holdem-poker-choices";
import { TexasHoldemPokerGameData } from "../event-models/texas-holdem-poker-game-data";
import TexasHoldemPokerHandler from "./texas-holdem-poker-event-handler";

export type TexasHoldemDeal<Choices> = {
    deal: {
        player: Array<Record<string, number>>;
        communityCards: Array<Record<string, number>>;
        combinationResult: {
            player: {
                id: number;
                combinationCards: Array<Record<string, number>>;
                cards: Array<Record<string, number>>;
            };
        };
        choices: Record<string, number>;
        roundId: number;
        totalAmount: number;
    };
};

export default class TexasHoldemDealEventHandler<Choices> extends TexasHoldemPokerHandler<TexasHoldemDeal<Choices>, Choices> {
    protected verifyEvent(event: TexasHoldemDeal<Choices>) {
        return !!event.deal;
    }

    protected handle(event: TexasHoldemDeal<Choices>) {
        const { player, combinationResult, roundId, totalAmount } = event.deal;
        const playerCard = player.map((e) => {
            return { rank: e.rank, suit: e.suit };
        });

        const choices = new TexasHoldemPokerChoices();
        choices.anteBet = event.deal.choices.ante;

        this.gameData.stateModel.dealing();
        this.gameData.emit(TexasHoldemPokerGameData.Events.CHOICES_RESULT, choices);
        this.gameData.ownBets.updateRoundId(roundId);
        this.gameData.dealModel.changeDataAfterDeal(playerCard, [], combinationResult, roundId);
        this.gameData.placeBetModel.updateTotalBet({ totalBet: totalAmount, choice: choices });
    }
}
