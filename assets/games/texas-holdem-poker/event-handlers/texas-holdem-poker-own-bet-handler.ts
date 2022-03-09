import { CardModel } from "./../texas-type";
import { cloneDeep } from "lodash";
import TexasHoldemPokerGameData from "../event-models/texas-holdem-poker-game-data";
import TexasHoldemPokerEventHandler from "./texas-holdem-poker-event-handler";

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
        const betsConverted = {};

        if (bets["ante"]) {
            betsConverted["anteBet"] = cloneDeep(bets["ante"]);
        }
        if (bets["call"]) {
            betsConverted["callBet"] = cloneDeep(bets["call"]);
        }
        if (bets["river"]) {
            betsConverted["riverBet"] = cloneDeep(bets["river"]);
        }
        if (bets["turn"]) {
            betsConverted["turnBet"] = cloneDeep(bets["turn"]);
        }

        const convertedCommunityCards = communityCards.map((e) => {
            return { rank: e.rank, suit: e.suit };
        });
        const convertedPlayerCards = player.map((e) => {
            return { rank: e.rank, suit: e.suit };
        });

        this.gameData.emit(TexasHoldemPokerGameData.Events.CHOICES_RESULT, betsConverted);
        this.gameData.stateModel.rejoinTable(convertedCommunityCards.length);
        this.gameData.ownBets.changeOwnBets({
            totalAmount: totalAmount,
            combinationResult: combinationResult,
            communityCards: convertedCommunityCards,
            bets: betsConverted,
            playerCards: convertedPlayerCards,
            roundId: roundId
        });
    }
}
