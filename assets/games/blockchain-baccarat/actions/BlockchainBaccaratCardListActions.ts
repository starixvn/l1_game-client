import { Blockchain } from "../event-models/BlockchainBaccaratCardListModel";
import { BlockchainBaccaratFinish } from "../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export const renderCardSettlement = (mainGame: BlockchainBaccarat) => (finishData: BlockchainBaccaratFinish) => {
    mainGame.cardList?.updateData(finishData.blockchain);
};

export const updateBlockchainCardList = (mainGame: BlockchainBaccarat) => (blockchain: Blockchain) => {
    mainGame.cardList?.setData(blockchain);
};
