import PokerCards from "./texas-holdem-poker-cards";

export const dealPlayerAndDealerCards = async (pokerCardsNote: PokerCards, cardsData: any, callBack?: Function) => {
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    const { playerCards } = cardsData;
    const dealerFakeData = [
        { rank: "1", suit: 1 },
        { rank: "1", suit: 1 }
    ];

    pokerCardsNote.drawingCardToPlayer(playerCards[0], false, 0);

    await pokerCardsNote.drawingCardToDealer(dealerFakeData[0], true, 0);

    await pokerCardsNote.drawingCardToPlayer(playerCards[1], false, 1);

    await pokerCardsNote.drawingCardToDealer(dealerFakeData[1], true, 1);

    pokerCardsNote.focusPlayerCard();
    showIndicatorSymbols(pokerCardsNote, cardsData, callBack, 0);
    //callBack();
};

export const dealFirstThreeCommunityCards = async (pokerCardsNote: PokerCards, cardsData: any, callBack?: Function) => {
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    const { communityCards } = cardsData;

    for (let index = 0; index < communityCards.length; index++) {
        const card = communityCards[index];
        await pokerCardsNote.drawingCardToMiddle(card, false);
    }

    showIndicatorSymbols(pokerCardsNote, cardsData, callBack, 0);
};

export const dealSecondCard = async (pokerCardsNote: PokerCards, cardsData: any, callBack?: Function) => {
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    const { communityCards } = cardsData;
    const communityCardsNew = communityCards.slice(-1);

    for (let index = 0; index < communityCardsNew.length; index++) {
        const element = communityCardsNew[index];
        await pokerCardsNote.drawingCardToMiddle(element, false);
    }

    showIndicatorSymbols(pokerCardsNote, cardsData, callBack, 0);
};

export const dealThirdCardAndFaceUpDealerCards = async (
    pokerCardsNote: PokerCards,
    cardsData: any,
    callBack?: Function,
    numberCommunityCards: number = -1
) => {
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    const { communityCards, dealerCards } = cardsData;

    const communityCardsNew = communityCards.slice(numberCommunityCards);

    for (let index = 0; index < communityCardsNew.length; index++) {
        const element = communityCardsNew[index];
        await pokerCardsNote.drawingCardToMiddle(element, false);
    }

    for (let index = 0; index < dealerCards.length; index++) {
        const element = dealerCards[index];
        await pokerCardsNote.faceUpDealerCard(element, index);
    }

    showIndicatorSymbols(pokerCardsNote, cardsData, callBack, 2000);
};

export const dealFourAndFireCardAndFaceUpDealerCards = async (pokerCardsNote: PokerCards, cardsData: any, callBack?: Function) => {
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    const { communityCards, dealerCards, step } = cardsData;

    const communityCardsNew = communityCards.slice(step === "call" ? -2 : -1);

    for (let index = 0; index < communityCardsNew.length; index++) {
        const element = communityCardsNew[index];
        await pokerCardsNote.drawingCardToMiddle(element, false);
    }

    for (let index = 0; index < dealerCards.length; index++) {
        const element = dealerCards[index];
        await pokerCardsNote.faceUpDealerCard(element, index);
    }

    showIndicatorSymbols(pokerCardsNote, cardsData, callBack, 1700);
};

export const collectCards = (pokerCardsNote: PokerCards, callBack?: Function, delayCallBack: number = 0) => {
    const durationCollectCard = 2700;
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    pokerCardsNote.collectCardsOnTable();
    const waitingCollectCard = pokerCardsNote.isCollectedCard ? delayCallBack : durationCollectCard;
    setTimeout(() => {
        callBack && callBack();
    }, waitingCollectCard);
};

const showIndicatorSymbols = (pokerCardsNote: PokerCards, cardsData: any, callBack?: Function, delayCallBack: number = 2000) => {
    const { combinationResult } = cardsData;
    const { player, dealer } = combinationResult;

    pokerCardsNote.showIndicatorSymbolOfCards(player.combinationCards, "player");
    dealer && pokerCardsNote.showIndicatorSymbolOfCards(dealer.combinationCards, "dealer");

    dealer && pokerCardsNote.showLabelIndicatorCards(dealer.id, "dealer");
    pokerCardsNote.showLabelIndicatorCards(player.id, "player");

    setTimeout(() => {
        callBack && callBack();
    }, delayCallBack);
};

export const rawCardWhenRejoin = (pokerCardsNote: PokerCards, cardsData: any, callBack?: Function) => {
    const { combinationResult, communityCards, playerCards } = cardsData;
    const { player } = combinationResult;

    const dealerDataFake = [
        { rank: 6, suit: 3 },
        { rank: 6, suit: 3 }
    ];

    for (let index = 0; index < playerCards.length; index++) {
        const card = playerCards[index];
        pokerCardsNote.drawingRejoinPlayerCards(card, false);
    }
    for (let index = 0; index < communityCards.length; index++) {
        const card = communityCards[index];
        pokerCardsNote.drawingRejoinMiddleCards(card, false);
    }
    for (let index = 0; index < dealerDataFake.length; index++) {
        const card = dealerDataFake[index];
        pokerCardsNote.drawingRejoinDealerCards(card, true);
    }
    pokerCardsNote.showIndicatorSymbolOfCards(player.combinationCards, "player");
    pokerCardsNote.showLabelIndicatorCards(player.id, "player");
    pokerCardsNote.focusPlayerCard();
};
