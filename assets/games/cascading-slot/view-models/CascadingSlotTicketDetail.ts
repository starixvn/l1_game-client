import * as i18n from "i18n/runtime-scripts/LanguageData";

import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import CascadingSlotTicketDetailItem from "./CascadingSlotTicketDetailItem";
import CascadingSlotTotalMultiplier from "./CascadingSlotTotalMultiplier";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTicketDetail extends cc.Component {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    totalMultiplierPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    multiplierNode: cc.Node = null;

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
        this.roundId.string = data.id;
        const tumbles = data.settlementResult.tumbles;
        const freeSpin = data.freeSpin;
        const countScatter = data.settlementResult.freeSpins.count;
        const countFreeSpin = data.settlementResult.freeSpins.odds;
        const isFreeSpin = countScatter > 3;
        let lbMulti = "";

        let currWinTumble = 0;
        tumbles.forEach((tumble, index) => {
            const detailItem = cc.instantiate(this.ticketDetailItemPrefab);
            const control = detailItem.getComponent(CascadingSlotTicketDetailItem);
            currWinTumble += tumble.win;
            if (index === tumbles.length - 1 && isFreeSpin) {
                control.setDataHaveFreeSpin(countScatter, countFreeSpin, index, currWinTumble, freeSpin);
            } else {
                control.setData(tumble, index, currWinTumble);
            }
            this.content.addChild(detailItem);
            control.setDataResultBoard(tumble.originalBoard, tumble.multipliers);
        });

        if (freeSpin) {
            lbMulti = `treasureIsland.totalMultiplier`;
            this.multiplierTotal.string = data.totalMultiplier;
            this.textMultiplier.node.color = this.multiplierTotal.node.color = cc.color(66, 190, 254);
            this.multiplierNode.active = +data.totalMultiplier > 0;
        } else {
            lbMulti = `treasureIsland.multiplier`;
            this.multiplierTotal.string = data.multiplier;
            this.multiplierNode.active = +data.multiplier > 0;
        }
        this.textMultiplier.string = `${i18n.t(lbMulti)}` + ":";
        const btnTextMulti = this.textMultiplier.getComponent(cc.Button);
        const btnValueMulti = this.multiplierTotal.getComponent(cc.Button);
        btnTextMulti.interactable = btnValueMulti.interactable = freeSpin;
        this.winTotal.string = numberWithCommas(data.betwin, 2, false);
    }

    onClickMultiplier() {
        const totalMultiplier = cc.instantiate(this.totalMultiplierPrefab);
        const totalControl = totalMultiplier.getComponent(CascadingSlotTotalMultiplier);
        totalControl.setData(this.data);
        this.node.addChild(totalMultiplier);
    }
}
