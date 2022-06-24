import { BaccaratSettlementResult } from "./../../baccarat/view-models/event-models/BaccaratSettlementResult";
import { CardsOrder } from "./../view-models/BlockchainBaccaratCardsUI";
import { BlockchainBaccaratFinish } from "./../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccaratCardsUI from "../view-models/BlockchainBaccaratCardsUI";
import BlockchainCard from "../components/card-list/view-models/BlockchainCard";


export const openCards = (cardsUI: BlockchainBaccaratCardsUI) => async (dataFinish: BlockchainBaccaratFinish, callback: () => void) => {
    const result = dataFinish.result;
    let isFlyCard3Player = false;

    await cardsUI.playerCards.openCards(cardsUI.playerCards.cards[CardsOrder.card1], result.player.card1);
    await cardsUI.playerCards.openCards(cardsUI.playerCards.cards[CardsOrder.card2], result.player.card2);

    await cardsUI.bankerCards.openCards(cardsUI.bankerCards.cards[CardsOrder.card1], result.banker.card1);
    await cardsUI.bankerCards.openCards(cardsUI.bankerCards.cards[CardsOrder.card2], result.banker.card2);

    if (result?.player?.card3?.rank) {
        isFlyCard3Player = true;
        await cardsUI.flyCard3(true);
        await cardsUI.playerCards.openCards(cardsUI.playerCards.cards[CardsOrder.card3], result.player.card3);
    }

    if (result?.banker?.card3?.rank) {
        await cardsUI.flyCard3(false, isFlyCard3Player);
        await cardsUI.bankerCards.openCards(cardsUI.bankerCards.cards[CardsOrder.card3], result.banker.card3);
    }
    callback();
    showHighlightCards(cardsUI, dataFinish.settlementResult);
};

export const showHighlightCards = (cardsUI: BlockchainBaccaratCardsUI, settlementResult: BaccaratSettlementResult) => {
    let cards: cc.Node[] = [];
    if (settlementResult.banker) {
        cards = cardsUI.bankerCards.cards;
    } else if (settlementResult.player) {
        cards = cardsUI.playerCards.cards;
    }

    cards.forEach((card: cc.Node) => {
        card.getComponentInChildren(BlockchainCard).setHighlight();
    });
};
