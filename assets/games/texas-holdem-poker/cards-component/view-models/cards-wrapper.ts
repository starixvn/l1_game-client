import { convertCard } from "../../../holdem-poker/components/cards/view-models/CardWrapper";
import PokerCards from "./texas-holdem-poker-cards";

const handleCommunityCards = async (pokerCardsNote, communityCards) => {
    for (const element of communityCards) {
        await pokerCardsNote.drawingCardToMiddle(element, false);
    }

    return pokerCardsNote;
};
export const dealPlayerAndDealerCards = async (pokerCardsNote: PokerCards, cardsData: any, callBack?: () => void) => {
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
};

export const dealFirstThreeCommunityCards = async (pokerCardsNote: PokerCards, cardsData: any, callBack?: () => void) => {
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    const { communityCards } = cardsData;
    pokerCardsNote = await handleCommunityCards(pokerCardsNote, communityCards);

    showIndicatorSymbols(pokerCardsNote, cardsData, callBack, 0);
};

export const dealSecondCard = async (pokerCardsNote: PokerCards, cardsData: any, callBack?: () => void) => {
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    const { communityCards } = cardsData;
    const communityCardsNew = communityCards.slice(-1);
    pokerCardsNote = await handleCommunityCards(pokerCardsNote, communityCardsNew);

    showIndicatorSymbols(pokerCardsNote, cardsData, callBack, 0);
};

export const dealThirdCardAndFaceUpDealerCards = async (
    pokerCardsNote: PokerCards,
    cardsData: any,
    callBack?: () => void,
    showResultMD5?: () => void
) => {
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    const { communityCards, dealerCards } = cardsData;

    const communityCardsNew = communityCards.slice(-1);
    pokerCardsNote = await handleCommunityCards(pokerCardsNote, communityCardsNew);

    for (let index = 0; index < dealerCards.length; index++) {
        const element = dealerCards[index];
        await pokerCardsNote.faceUpDealerCard(element, index);
    }

    showResultMD5 && showResultMD5();
    showIndicatorSymbols(pokerCardsNote, cardsData, callBack, 2000);
};

export const dealFourAndFireCardAndFaceUpDealerCards = async (pokerCardsNote: PokerCards, cardsData: any, callBack?: () => void) => {
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    const { communityCards, dealerCards, step } = cardsData;

    const communityCardsNew = communityCards.slice(step === "call" ? -2 : -1);

    pokerCardsNote = await handleCommunityCards(pokerCardsNote, communityCardsNew);

    for (let index = 0; index < dealerCards.length; index++) {
        const element = dealerCards[index];
        await pokerCardsNote.faceUpDealerCard(element, index);
    }

    showIndicatorSymbols(pokerCardsNote, cardsData, callBack, 1700);
};

export const collectCards = (pokerCardsNote: PokerCards, callBack?: () => void, delayCallBack = 0) => {
    const durationCollectCard = 2700;
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    pokerCardsNote.collectCardsOnTable();
    const waitingCollectCard = pokerCardsNote.isCollectedCard ? delayCallBack : durationCollectCard;
    setTimeout(() => {
        callBack && callBack();
    }, waitingCollectCard);
};

const showIndicatorSymbols = (pokerCardsNote: PokerCards, cardsData: any, callBack?: () => void, delayCallBack = 2000) => {
    const { combinationResult } = cardsData;
    const { player, dealer } = combinationResult;

    pokerCardsNote.showIndicatorSymbolOfCards(convertCard(player.combinationCards), "player");
    dealer && pokerCardsNote.showIndicatorSymbolOfCards(convertCard(dealer.combinationCards), "dealer");

    dealer && pokerCardsNote.showLabelIndicatorCards(dealer.id, "dealer");
    pokerCardsNote.showLabelIndicatorCards(player.id, "player");

    setTimeout(() => {
        callBack && callBack();
    }, delayCallBack);
};

export const rawCardWhenRejoin = (pokerCardsNote: PokerCards, cardsData: any) => {
    const { combinationResult, communityCards, playerCards } = cardsData;
    const { player } = combinationResult;

    const dealerDataFake = [
        { rank: "6", suit: 3 },
        { rank: "6", suit: 3 }
    ];

    for (const card of playerCards) {
        pokerCardsNote.drawingRejoinPlayerCards(card, false);
    }

    for (const card of communityCards) {
        pokerCardsNote.drawingRejoinMiddleCards(card, false);
    }

    for (const card of dealerDataFake) {
        pokerCardsNote.drawingRejoinDealerCards(card, false);
    }

    pokerCardsNote.showIndicatorSymbolOfCards(convertCard(player.combinationCards), "player");
    pokerCardsNote.showLabelIndicatorCards(player.id, "player");
    pokerCardsNote.focusPlayerCard();
};
