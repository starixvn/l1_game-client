import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import LotteryResult from "./LotteryResult";
import LotteryTicketDetailItem from "./LotteryTicketDetailItem";
import * as _ from "lodash";

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
        const { betLogDetails, phien } = data;
        const choices = {};
        betLogDetails.forEach((log) => {
            _.merge(choices, log.choices);
        });
        this.result.setData(data, false, choices);
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
