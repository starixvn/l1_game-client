import HiLoTicketDetailItem from "./HiLoTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketDetail extends cc.Component {
    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    initTicketDetail(betLogDetails: []) {
        betLogDetails.forEach((logDetail) => {
            const ticketDetailItem = cc.instantiate(this.ticketDetailItemPrefab);
            const detailControl = ticketDetailItem.getComponent(HiLoTicketDetailItem);
            detailControl.renderTicketDetailItem(logDetail);
        });
    }
}
