import BlockchainBaccaratCardsUI from "../view-models/BlockchainBaccaratCardsUI";

export const showCards = (cardsUI: BlockchainBaccaratCardsUI) => (dataFinish: any, showResultFunc: () => void) => {
    const result = dataFinish.result;
    const playerCards = getDataFollowTypePlayer(result, false);
    const bankerCards = getDataFollowTypePlayer(result, true);

    cardsUI.playerCard.showCards(playerCards, bankerCards.length === 3 ? null : showResultFunc);
    cardsUI.bankerCard.showCards(bankerCards, bankerCards.length === 3 ? showResultFunc : null, playerCards.length === 3);
};

const getDataFollowTypePlayer = (data: any, isBanker: boolean) => {
    if (isBanker) {
        return Object.values(data.banker).filter((value) => value != null);
    }
    return Object.values(data.player).filter((value) => value != null);
};
