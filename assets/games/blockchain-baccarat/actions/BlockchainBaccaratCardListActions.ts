import BlockchainCardList from "../components/card-list/view-models/BlockchainCardList";
import { Blockchain } from "../event-models/BlockchainBaccaratCardListModel";
import { BlockchainBaccaratFinish } from "../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export const renderCardSettlement = (cardList: BlockchainCardList) => (finishData: BlockchainBaccaratFinish) => {
    cardList?.renderCardsSettlement(finishData?.blockchain);
};

export const updateBlockchainCardList = (mainGame: BlockchainBaccarat) => (blockchain: Blockchain) => {
    mainGame.cardList?.updateBlockchain(blockchain);
    mainGame.cardList?.setData();
    mainGame.gameData.cardList.currentIndex = blockchain.currentIndex;
    mainGame.gameData.cardList.numberCardsFly = 6;
    mainGame.cardsUI.handleNumberIndex(blockchain.currentIndex);
};
