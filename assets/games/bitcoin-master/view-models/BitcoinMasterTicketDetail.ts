import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import BitcoinMasterTicketDetailItem from "./BitcoinMasterTicketDetailItem";
import BitcoinMasterUtils from "./BitcoinMasterUtils";

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
        const { betLogDetails, result } = data;
        this.setGeneralInfo(data);
        const total = betLogDetails.length;
        betLogDetails.forEach((detail, index) => {
            const node = cc.instantiate(this.ticketItemPrefab);
            this.content.addChild(node);
            node.active = true;
            const item = node.getComponent(BitcoinMasterTicketDetailItem);
            item.setData(detail, result);
            if (index === total - 1) {
                item.lineBottom.active = false;
            }
        });
    }

    setGeneralInfo(data) {
        const { phien, result } = data;
        this.roundID.string = phien;
        this.openValue.string = BitcoinMasterUtils.formattingBitcoinValue(result.open);
        this.closeValue.string = BitcoinMasterUtils.formattingBitcoinValue(result.close);
    }
}
