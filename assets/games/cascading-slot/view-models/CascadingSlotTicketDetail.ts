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
    winTotal: cc.Label = null;

    data: any = null;

    private HEIGHT_CONTENT = 380;

    onLoad() {
        this.commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }
    setData(data: any) {
        this.data = data;
        const tumbles = data.settlementResult.tumbles;
        const isFreeSpin = data.freeSpin || data.settlementResult.freeSpins.count > 0;
        tumbles.forEach((tumble, index) => {
            const detailItem = cc.instantiate(this.ticketDetailItemPrefab);
            const control = detailItem.getComponent(CascadingSlotTicketDetailItem);
            control.setData(tumble, index);
            this.content.addChild(detailItem);
        });
        if (isFreeSpin) {
            const detailItem = cc.instantiate(this.ticketDetailItemPrefab);
            const control = detailItem.getComponent(CascadingSlotTicketDetailItem);
            control.setDataHaveFreeSpin(data.settlementResult.freeSpins.count, data.settlementResult.freeSpins.odds);
        }
        this.multiplierTotal.string = data.totalMultiplier;
        this.winTotal.string = data.totalTumbleWin;

        var freeSpinCount = (data.freeSpin ? data.settlementResult.additionalFreeSpins : data.settlementResult.freeSpins).count;
        var textFreeSpin = data.freeSpin ? "Extra Free Spin" : "Free Spin";
    }

    onClickMultiplier() {
        const totalMultiplier = cc.instantiate(this.totalMultiplierPrefab);
        const totalControl = totalMultiplier.getComponent(CascadingSlotTotalMultiplier);
        totalControl.setData(this.data);
        this.node.addChild(totalMultiplier);
    }
}
