import { BaccaratSettlementResult } from "./../../baccarat/view-models/event-models/BaccaratSettlementResult";
import { CardsOrder } from "./../view-models/BlockchainBaccaratCardsUI";
import { BlockchainBaccaratFinish } from "./../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccaratCardsUI from "../view-models/BlockchainBaccaratCardsUI";
import BlockchainCard from "../view-models/card-list/BlockchainCard";

export const openCards = (cardsUI: BlockchainBaccaratCardsUI) => async (dataFinish: BlockchainBaccaratFinish) => {
    const result = dataFinish.result;
    await cardsUI.playerCards.openCards(cardsUI.playerCards.cards[CardsOrder.card1], result.player.card1, true);
    await cardsUI.playerCards.openCards(cardsUI.playerCards.cards[CardsOrder.card2], result.player.card2, true);

    await cardsUI.bankerCards.openCards(cardsUI.bankerCards.cards[CardsOrder.card1], result.banker.card1, true);
    await cardsUI.bankerCards.openCards(cardsUI.bankerCards.cards[CardsOrder.card2], result.banker.card2, true);

    if (result?.player?.card3?.rank) {
        await cardsUI.flyCard3(true);
        await cardsUI.playerCards.openCards(cardsUI.playerCards.cards[CardsOrder.card3], result.player.card3, true);
    }

    if (result?.banker?.card3?.rank) {
        await cardsUI.flyCard3();
        await cardsUI.bankerCards.openCards(cardsUI.bankerCards.cards[CardsOrder.card3], result.banker.card3, true);
    }
    showHighlight(cardsUI, dataFinish.settlementResult);
};

const showHighlight = (cardsUI: BlockchainBaccaratCardsUI, settlementResult: BaccaratSettlementResult) => {
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
