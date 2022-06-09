import BaccaratBigRoadItem from "../../../../baccarat/view-models/BaccaratBigRoadItem";
const { ccclass } = cc._decorator;

@ccclass
export default class BlockchainBaccaratBigRoadItem extends BaccaratBigRoadItem {
    resetAll() {
        for (const node of this.nodes) {
            for (let index = 0; index < node.childrenCount; index++) {
                node.children[index].active = false;
            }
        }
    }
}
