import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import CascadingSlotTicketDetailItem from "./CascadingSlotTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotTicketDetail extends cc.Component {
    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    onLoad() {
        this.commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }
    setData(data: any) {
        const detailItem = cc.instantiate(this.ticketDetailItemPrefab);
        const control = detailItem.getComponent(CascadingSlotTicketDetailItem);
        const tumbles = data.settlementResult.tumbles;
        tumbles.forEach((tumble, index) => {
            control.setData(tumble, index);
            this.content.addChild(detailItem);
        });
    }
}
