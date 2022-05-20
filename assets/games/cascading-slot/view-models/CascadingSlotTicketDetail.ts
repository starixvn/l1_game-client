import * as i18n from "i18n/runtime-scripts/LanguageData";

import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import CascadingSlotTicketDetailItem from "./CascadingSlotTicketDetailItem";
import CascadingSlotTotalMultiplier from "./CascadingSlotTotalMultiplier";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTicketDetail extends cc.Component {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    totalMultiplierPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    multiplierTotal: cc.Label = null;

    @property(cc.Label)
    textMultiplier: cc.Label = null;

    @property(cc.Label)
    winTotal: cc.Label = null;

    data: any = null;

    onLoad() {
        this.commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }
    setData(data: any) {
        this.data = data;
        const tumbles = data.settlementResult.tumbles;
        const freeSpin = data.freeSpin;
        const normalFreeSpins = data.settlementResult.freeSpins;
        const extraFreeSpin = data.settlementResult.additionalFreeSpins;
        const isFreeSpin = freeSpin || normalFreeSpins.count > 0;
        const countScatter = (freeSpin ? extraFreeSpin : normalFreeSpins).count;
        const countFreeSpin = (freeSpin ? extraFreeSpin : normalFreeSpins).odds;
        tumbles.forEach((tumble, index) => {
            const detailItem = cc.instantiate(this.ticketDetailItemPrefab);
            const control = detailItem.getComponent(CascadingSlotTicketDetailItem);
            if (index === tumbles.length - 1 && isFreeSpin) {
                control.setDataHaveFreeSpin(countScatter, countFreeSpin, index, tumble.win, freeSpin);
            } else {
                control.setData(tumble, index);
            }
            this.content.addChild(detailItem);
            control.setDataResultBoard(tumble.originalBoard, tumble.multipliers);
        });
        const lbMulti = `treasureIsland.${freeSpin ? "totalMultiplier" : "multiplier"}`;
        this.textMultiplier.string = `${i18n.t(lbMulti)}` + ":";
        this.multiplierTotal.string = data.totalMultiplier;
        this.winTotal.string = data.totalTumbleWin;
    }

    onClickMultiplier() {
        const totalMultiplier = cc.instantiate(this.totalMultiplierPrefab);
        const totalControl = totalMultiplier.getComponent(CascadingSlotTotalMultiplier);
        totalControl.setData(this.data);
        this.node.addChild(totalMultiplier);
    }
}
