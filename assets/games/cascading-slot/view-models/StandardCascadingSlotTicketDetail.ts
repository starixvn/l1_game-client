import GameUtils from "../../../common/GameUtils";
import { uiManager } from "../../../managers/GameUIManager";
import CascadingSlotTicketDetail from "./CascadingSlotTicketDetail";
import CascadingSlotTicketDetailItem from "./CascadingSlotTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardCascadingSlotTicketDetail extends CascadingSlotTicketDetail {
    @property(cc.Prefab)
    mobileTicketDetailItemPrefab: cc.Prefab = null;

    loadDetailItem() {
        return GameUtils.isPhone() ? cc.instantiate(this.mobileTicketDetailItemPrefab) : cc.instantiate(this.ticketDetailItemPrefab);
    }

    async loadGameAtlas(control: CascadingSlotTicketDetailItem, gameId: number) {
        control.mainAtlas = uiManager.prefabCache.gameAtlas[gameId];
    }
}
