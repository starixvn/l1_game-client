import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import BitcoinMasterTicketDetailItem from "./BitcoinMasterTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterTicketDetail extends cc.Component {
    @property(cc.Label)
    roundID: cc.Label = null;

    @property(cc.Label)
    openValue: cc.Label = null;

    @property(cc.Label)
    closeValue: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    ticketItemPrefab: cc.Prefab = null;

    @property(CommonDialog)
    dialog: CommonDialog = null;

    onLoad() {
        this.dialog.addOnDidHide(() => this.node.destroy());
    }

    setData(data: any) {
        const { betLogDetails, phien, result } = data;

        this.roundID.string = phien;
        this.openValue.string = result.open;
        this.closeValue.string = result.close;

        const total = betLogDetails.length;
        betLogDetails.forEach((detail, index) => {
            const node = cc.instantiate(this.ticketItemPrefab);
            this.content.addChild(node);
            node.active = true;
            const item = node.getComponent(BitcoinMasterTicketDetailItem);
            item.setData(detail);
            item.lineBottom.active = index === total - 1;
        });
    }
}
