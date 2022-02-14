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

    @property(cc.Node)
    detailTable: cc.Node = null;

    private tableHeight = 80;
    private contentHeight = 0;

    setData(data: any) {
        const betLogDetails = data.betLogDetails;
        const startRound = this.renderDetailBase(data, true);
        this.content.addChild(startRound);
        this.contentHeight = 50;
        betLogDetails.forEach((logDetail) => {
            const ticketDetailItem = cc.instantiate(this.ticketDetailItemPrefab);
            const detailControl = ticketDetailItem.getComponent(HiLoTicketDetailItem);
            detailControl.renderTicketDetailItem(logDetail);
            this.contentHeight += 50;
            this.content.addChild(ticketDetailItem);
        });
        const endRound = this.renderDetailBase(data, false);
        this.content.addChild(endRound);
        this.contentHeight += 50;
        this.content.height = this.contentHeight;
        this.detailTable.height = this.tableHeight + this.contentHeight;
    }

    renderDetailBase(data: any, isFirst: boolean): cc.Node {
        const basedetailItem = cc.instantiate(this.detailBaseItemPrefab);
        const control = basedetailItem.getComponent(HiLoTicketDetailBaseItem);
        control.setData(data, isFirst);
        return basedetailItem;
    }
}
