import { BlockchainBaccaratFinishModel } from "../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccarat from "../view-models/BlockchainBaccarat";

export const updateCardList = (mainGame: BlockchainBaccarat) => (finishModel: BlockchainBaccaratFinishModel) => {
    mainGame.cardList?.setData(finishModel.finishData.blockchain);
};
