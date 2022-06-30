import BlockchainCardList from "../components/card-list/view-models/BlockchainCardList";
import { Blockchain } from "../event-models/BlockchainBaccaratCardListModel";
import { BlockchainBaccaratFinish } from "../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccaratCardsUI from "../view-models/BlockchainBaccaratCardsUI";

export const renderCardSettlement = (cardList: BlockchainCardList) => (finishData: BlockchainBaccaratFinish) => {
    if (cardList.node.active === false) {
        return;
    }
    cardList?.renderCardsSettlement(finishData?.blockchain);
};

export const updateBlockchainCardList =
    (cardList: BlockchainCardList, cardsUI: BlockchainBaccaratCardsUI) => (newBlockchain: Blockchain) => {
        cardList?.updateBlockchain(newBlockchain);
        cardList?.setData();
        cardsUI.handleNumberIndex(newBlockchain.currentIndex);
    };
