import PokerCards from "./HoldemPokerCards";

export const convertOldRank = (num: number): string => {
    num++;
    const dict = {
        11: "J",
        12: "Q",
        13: "K",
        1: "A"
    };
    return dict[num] || num.toString();
};
export const convertCard = (cards) => {
    return cards.map((e) => {
        return {
            rank: convertOldRank(e.rank),
            suit: e.suit
        };
    });
};

export const rawCardAfterClickDeal = async (pokerCardsNote: PokerCards, cardsData: any, callBack?: Function) => {
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    const { playerCards, communityCards } = cardsData;
    const dealerFakeData = [
        { rank: "1", suit: 1 },
        { rank: "1", suit: 1 }
    ];

    const playerCardsConverted = convertCard(playerCards);
    const communityCardsConverted = convertCard(communityCards);

    // =>player
    await pokerCardsNote.drawingCardToPlayer(playerCardsConverted[0], false, 0);
    //=> dealer
    await pokerCardsNote.drawingCardToDealer(dealerFakeData[0], true, 0);
    // => player
    await pokerCardsNote.drawingCardToPlayer(playerCardsConverted[1], false, 1);
    //=> dealer;
    await pokerCardsNote.drawingCardToDealer(dealerFakeData[1], true, 1);

    for (const element of communityCardsConverted) {
        await pokerCardsNote.drawingCardToMiddle(element, false);
    }

    pokerCardsNote.focusPlayerCard();
    showIndicator(pokerCardsNote, cardsData, callBack, 0);
};

export const rawCardAfterClickCall = async (pokerCardsNote: PokerCards, cardsData: any, callBack?: Function) => {
    const { communityCards, dealerCards } = cardsData;
    const communityCardsConverted = convertCard(communityCards.slice(-2));
    const dealerCardsConverted = convertCard(dealerCards);

    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();

    for (const element of communityCardsConverted) {
        await pokerCardsNote.drawingCardToMiddle(element, false);
    }

    let index = 0;
    for (const element of dealerCardsConverted) {
        await pokerCardsNote.faceUpDealerCard(element, index);
        index++;
    }

    showIndicator(pokerCardsNote, cardsData, callBack, 1000);
};

const showIndicator = (pokerCardsNote: PokerCards, cardsData: any, callBack?: Function, delayCallBack = 2000) => {
    const { combinationResult } = cardsData;
    const { playerResult, dealerResult, isQualified } = combinationResult;
    const playerCombinationCardsConverted: [
        {
            rank: string;
            suit: number;
        }
    ] = convertCard(playerResult.combinationCards);

    const dealerCombinationCardsConverted: [
        {
            rank: string;
            suit: number;
        }
    ] = dealerResult ? convertCard(dealerResult.combinationCards) : [];
    pokerCardsNote.showArrowIndicatorCards(playerCombinationCardsConverted, "player");
    pokerCardsNote.showArrowIndicatorCards(dealerCombinationCardsConverted, "dealer");

    dealerResult && pokerCardsNote.showLabelIndicatorCards(isQualified ? dealerResult.handResultId : 0, "dealer");
    pokerCardsNote.showLabelIndicatorCards(playerResult.handResultId, "player");

    setTimeout(() => {
        callBack && callBack();
    }, delayCallBack);
};

export const collectCart = (pokerCardsNote: PokerCards, callBack?: Function, delayCallBack = 0) => {
    const durationCollectCard = 1000;
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();
    pokerCardsNote.collectCardsOnTable();
    const waitingCollectCard = pokerCardsNote.isCollectedCard ? delayCallBack : durationCollectCard;
    setTimeout(() => {
        callBack && callBack();
    }, waitingCollectCard);
};
export const rawCardWhenRejoin = (pokerCardsNote: PokerCards, cardsData: any, callBack?: Function) => {
    const { combinationResult, communityCards, playerCards } = cardsData;
    const { playerResult } = combinationResult;

    const playerCombinationCardsConverted: [
        {
            rank: string;
            suit: number;
        }
    ] = convertCard(playerResult.combinationCards);

    const dealerDataFake = [
        { rank: "6", suit: 3 },
        { rank: "6", suit: 3 }
    ];
    pokerCardsNote.hideAllLabelIndicatorCards();
    pokerCardsNote.hideAllIndicator();

    const playerCardsConverted = convertCard(playerCards);
    const communityCardsConverted = convertCard(communityCards);

    playerCardsConverted.forEach((element) => {
        pokerCardsNote.drawingRejoinPlayerCards(element, false);
    });

    communityCardsConverted.forEach((element) => {
        pokerCardsNote.drawingRejoinMiddleCards(element, false);
    });

    dealerDataFake.forEach((element) => {
        pokerCardsNote.drawingRejoinDealerCards(element, true);
    });
    pokerCardsNote.showArrowIndicatorCards(playerCombinationCardsConverted, "player");
    pokerCardsNote.showLabelIndicatorCards(playerResult.handResultId, "player");
    pokerCardsNote.focusPlayerCard();
};
