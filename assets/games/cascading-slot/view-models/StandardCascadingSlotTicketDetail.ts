import GameUtils from "../../../common/GameUtils";
import CascadingSlotTicketDetail from "./CascadingSlotTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardCascadingSlotTicketDetail extends CascadingSlotTicketDetail {
    @property(cc.Prefab)
    mobileTicketDetailItemPrefab: cc.Prefab = null;

    loadDetailItem() {
        return GameUtils.isPhone() ? cc.instantiate(this.mobileTicketDetailItemPrefab) : cc.instantiate(this.ticketDetailItemPrefab);
    }
}
