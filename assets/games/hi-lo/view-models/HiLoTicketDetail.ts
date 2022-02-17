import { BetLog } from "./HiLoBetData";
import HiLoTicketDetailBaseItem from "./HiLoTicketDetailBaseItem";
import HiLoTicketDetailItem from "./HiLoTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketDetail extends cc.Component {
    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    detailBaseItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    view: cc.Node = null;

    @property(cc.Node)
    detailTable: cc.Node = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    private readonly tableHeight = 80;
    private contentHeight = 100;
    private readonly maxHeightContent = 500;
    private readonly heightPerRow = 50;

    setData(data: BetLog) {
        this.roundId.string = data.id.toString();
        const betLogDetails = data.betLogDetails;
        const startRound = this.renderDetailBase(data, true);
        this.content.addChild(startRound);
        betLogDetails.forEach((logDetail) => {
            const ticketDetailItem = cc.instantiate(this.ticketDetailItemPrefab);
            const detailControl = ticketDetailItem.getComponent(HiLoTicketDetailItem);
            detailControl.renderTicketDetailItem(logDetail);
            this.contentHeight += this.heightPerRow;
            this.content.addChild(ticketDetailItem);
        });
        const endRound = this.renderDetailBase(data, false);
        this.content.addChild(endRound);
        if (this.contentHeight >= this.maxHeightContent) {
            this.view.height = this.scrollView.node.height = this.maxHeightContent;
            this.detailTable.height = this.tableHeight + this.maxHeightContent;
        } else {
            this.view.height = this.scrollView.node.height = this.contentHeight;
            this.detailTable.height = this.tableHeight + this.contentHeight;
        }
    }

    renderDetailBase(data: BetLog, isFirst: boolean): cc.Node {
        const basedetailItem = cc.instantiate(this.detailBaseItemPrefab);
        const control = basedetailItem.getComponent(HiLoTicketDetailBaseItem);
        control.setData(data, isFirst);
        return basedetailItem;
    }
}
