import { BlockchainBaccaratFinish } from "../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export const updateCardList = (mainGame: BlockchainBaccarat) => (finishData: BlockchainBaccaratFinish) => {
    mainGame.cardList?.updateData(finishData.blockchain);
};
