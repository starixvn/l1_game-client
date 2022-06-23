import { Blockchain } from "../event-models/BlockchainBaccaratCardListModel";
import { BlockchainBaccaratFinish } from "../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";
import BlockchainCardList from "../view-models/card-list/BlockchainCardList";

export const renderCardSettlement = (cardList: BlockchainCardList) => (finishData: BlockchainBaccaratFinish) => {
    cardList?.renderCardsSettlement(finishData?.blockchain);
};

export const updateBlockchainCardList = (mainGame: BlockchainBaccarat) => (blockchain: Blockchain) => {
    mainGame.cardList?.updateBlockchain(blockchain);
    mainGame.cardList?.setData();
    mainGame.gameData.cardList.updateCurrentIndex(blockchain.currentIndex);
    mainGame.gameData.cardList.changeNumberCardsFly(6);
    mainGame.cardsUI.handleNumberIndex(blockchain.currentIndex);
};
