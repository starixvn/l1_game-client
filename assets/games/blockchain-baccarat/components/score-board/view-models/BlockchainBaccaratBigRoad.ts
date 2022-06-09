import BaccaratBigRoad from "../../../../baccarat/view-models/BaccaratBigRoad";
import BlockchainBaccaratBigRoadItem from "./BlockchainBaccaratBigRoadItem";
const { ccclass } = cc._decorator;

@ccclass
export default class BlockChainBaccaratBigRoad extends BaccaratBigRoad {
    public getData() {
        return this.bigRoadData;
    }

    public resetBoard() {
        const contentLength = this.content.childrenCount;
        this.updateContentChild(this.minColumn - contentLength);
        for (let index; index < contentLength; index++) {
            this.content.children[index].getComponent(BlockchainBaccaratBigRoadItem).resetAll();
        }
    }
}
