import { CardModel } from "./../texas-type";
import TexasHoldemPokerGameData from "../event-models/texas-holdem-poker-game-data";
import TexasHoldemPokerEventHandler from "./texas-holdem-poker-event-handler";
import { convertChoices } from "../texas-helper";

export type TexasHoldemDeal = {
    deal: {
        player: CardModel[];
        communityCards: CardModel[];
        combinationResult: {
            player: {
                id: number;
                combinationCards: CardModel[];
                cards: CardModel[];
            };
        };
        choices: Record<string, number>;
        roundId: number;
        totalAmount: number;
    };
};

export default class TexasHoldemDealEventHandler<Choices> extends TexasHoldemPokerEventHandler<TexasHoldemDeal, Choices> {
    protected verifyEvent(event: TexasHoldemDeal) {
        return !!event.deal;
    }

    protected handle(event: TexasHoldemDeal) {
        const { player, combinationResult, roundId, totalAmount, choices } = event.deal;
        const choiceProcess = convertChoices({ ante: choices.ante });

        this.gameData.stateModel.dealing();
        this.gameData.emit(TexasHoldemPokerGameData.Events.CHOICES_RESULT, choices);
        this.gameData.ownBets.updateRoundId(roundId);
        this.gameData.dealModel.changeDataAfterDeal(player, [], combinationResult, roundId);
        this.gameData.placeBetModel.updateTotalBet({ totalBet: totalAmount, choice: choiceProcess });
    }
}
