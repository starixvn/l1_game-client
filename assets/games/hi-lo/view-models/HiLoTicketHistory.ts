import HiLoTicketHistoryItem from "./HiLoTicketHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketHistory extends cc.Component {
    @property(cc.Prefab)
    ticketHistoryItemPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    renderTicketHisroty(data) {
        //this.content.children.forEach((child) => child.destroy());
        data.forEach((item) => {
            const itemNode = cc.instantiate(this.ticketHistoryItemPrefab);
            const control = itemNode.getComponent(HiLoTicketHistoryItem);
            control.renderTicketItem(item.time, item.id, item.amount, item.betwin);
            this.content.addChild(itemNode);
        });
        console.log(this.content.children.length);
    }
}
