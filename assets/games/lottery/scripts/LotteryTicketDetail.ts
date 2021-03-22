import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import LotteryResult from "./LotteryResult";
import LotteryTicketDetailItem from "./LotteryTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryTicketDetail extends cc.Component {
    @property(LotteryResult)
    result: LotteryResult = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemSample: cc.Node = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(CommonDialog)
    dialog: CommonDialog = null;

    onLoad() {
        this.dialog.onDidHide = () => this.node.destroy();
    }

    setData(data: any) {
        const { result, betLogDetails, phien } = data;
        this.result.setData(result, false);
        this.roundId.string = `#${phien}`;

        const total = betLogDetails.length;
        betLogDetails.forEach((detail, index) => {
            const node = cc.instantiate(this.itemSample);
            this.content.addChild(node);
            node.active = true;
            const item = node.getComponent(LotteryTicketDetailItem);
            item.setData(detail, index, data);
            item.lineBottom.active = index === total - 1;
        });
    }
}
