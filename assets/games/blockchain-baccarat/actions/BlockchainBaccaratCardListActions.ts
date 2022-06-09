import { BlockchainBaccaratFinishModel } from "../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export const updateCardList = (mainGame: BlockchainBaccarat) => (finishModel: BlockchainBaccaratFinishModel) => {
    mainGame.cardList?.updateData(finishModel.finishData.blockchain);
};
