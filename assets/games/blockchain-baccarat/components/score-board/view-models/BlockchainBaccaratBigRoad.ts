import BaccaratBigRoad from "../../../../_baccarat/BaccaratBigRoad";
import { BlockchainBaccaratRoundHistory } from "../../../event-models/BlockchainBaccaratRoundHistory";
const { ccclass } = cc._decorator;

@ccclass
export default class BlockChainBaccaratBigRoad extends BaccaratBigRoad {
    public getData() {
        return this.bigRoadData;
    }

    public renderScoreBoardInGame(data: BlockchainBaccaratRoundHistory[]) {
        this.firstRender = false;
        this.isRenderedNext = false;
        super.renderScoreBoardInGame(data);
    }
}
