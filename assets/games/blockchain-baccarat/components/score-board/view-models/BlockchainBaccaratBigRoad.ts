import BaccaratBigRoad from "../../../../baccarat/view-models/BaccaratBigRoad";
import { BlockchainBaccaratRoundHistory } from "../../../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccaratBigRoadItem from "./BlockchainBaccaratBigRoadItem";
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

    public resetBoard() {
        this.bigRoadData = [];
        this.updateContentChild(this.minColumn - this.content.childrenCount);
        for (let index = 0; index < this.content.childrenCount; index++) {
            this.content.children[index].getComponent(BlockchainBaccaratBigRoadItem).resetAll();
        }
    }
}
