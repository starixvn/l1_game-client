import * as _ from "lodash";

import { HoldemPokerCardModel } from "../event-models/HoldemPokerCardModel";
import HoldemPokerChoices from "../event-models/HoldemPokerChoices";
import { CardResult, HoldemPokerCombinationResult } from "../event-models/HoldemPokerCombinationResult";
import { HoldemPokerGameData } from "../event-models/HoldemPokerGameData";
import HoldemPokerEventHandler from "./HoldemPokerEventHandler";

export type HoldemPokerOwnBetType<Choices> = {
    ownBets: {
        roundId: number;
        bets: Record<string, number>;
        player: Array<Record<string, number>>;
        communityCards: Array<Record<string, number>>;
        combinationResult: {
            player: {
                id: number;
                combinationCards: Array<Record<string, number>>;
                cards: Array<Record<string, number>>;
            };
        };
        totalAmount: number;
    };
};

export default class HoldemPokerOwnBetHandler<Choices> extends HoldemPokerEventHandler<HoldemPokerOwnBetType<Choices>, Choices> {
    protected verifyEvent(event: HoldemPokerOwnBetType<Choices>) {
        return !!event.ownBets;
    }

    protected handle(event: HoldemPokerOwnBetType<Choices>) {
        this.gameData.isProcessingBet = false;
        if (!_.isEmpty(event.ownBets)) {
            const combinationResult = new HoldemPokerCombinationResult();
            const { player } = event.ownBets.combinationResult;
            combinationResult.playerResult = new CardResult();
            combinationResult.playerResult.handResultId = player.id;
            combinationResult.playerResult.combinationCards = player.combinationCards.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

            const playerCards = event.ownBets.player.map((c) => new HoldemPokerCardModel(c.rank, c.suit));
            const communityCards = event.ownBets.communityCards.map((c) => new HoldemPokerCardModel(c.rank, c.suit));

            const choices = new HoldemPokerChoices();
            choices.aa = event.ownBets.bets.aa ?? 0;
            choices.ante = event.ownBets.bets.ante;

            const { roundId, totalAmount } = event.ownBets;
            this.gameData.emit(HoldemPokerGameData.Events.CHOICES_RESULT, event.ownBets.bets);
            this.gameData.emit(HoldemPokerGameData.Events.CHANGE_STATE, this);
            this.gameData.ownBets.changeOwnBets({ bets: choices, playerCards, communityCards, combinationResult, roundId, totalAmount });
        }
    }
}
