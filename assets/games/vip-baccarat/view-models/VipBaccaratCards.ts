import BaccaratCards from "../../baccarat/view-models/BaccaratCards";

const { ccclass } = cc._decorator;

@ccclass
export default class VipBaccaratCards extends BaccaratCards {
    resetCard(card: cc.Node) {
        super.resetCard(card);
    }
}
