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
        const freeSpin = data.freeSpin;
        this.roundId.string = freeSpin ? `${data.id} (Free Spin)` : `${data.id}`;
        const tumbles = data.settlementResult.tumbles;
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
            const newTumbleMultipliers = index < tumbles.length - 1 ? [...tumbles[index + 1].multipliers] : [...tumble.multipliers];
            control.setDataResultBoard(tumble.originalBoard, newTumbleMultipliers);
        });

        if (freeSpin) {
            if (data.totalMultipliers) {
                lbMulti = `treasureIsland.totalMultiplier`;
                this.multiplierTotal.string = data.totalMultiplier;
                this.multiplierTotal.node.color = this.textMultiplier.node.color = cc.color(66, 190, 254);
                this.multiplierNode.active = true;
            }
        } else {
            lbMulti = `treasureIsland.multiplier`;
            this.multiplierTotal.string = data.multiplier;
            this.multiplierNode.active = tumbles.length > 1 && +data.multiplier > 0;
        }
        this.textMultiplier.string = `${i18n.t(lbMulti)}:`;
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
