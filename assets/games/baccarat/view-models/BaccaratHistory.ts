import GameUtils from "../../../common/GameUtils";
import VipBaccaratHistory from "../../vip-baccarat/view-models/VipBaccaratHistory";

const { ccclass } = cc._decorator;
@ccclass
export default class BaccaratHistory extends VipBaccaratHistory {
    start() {
        super.start();
        const header = this.wrapperContent.children[1];
        GameUtils.setFontSizeLabelsInNode(header, true, cc.Label.Overflow.CLAMP);
    }
}
