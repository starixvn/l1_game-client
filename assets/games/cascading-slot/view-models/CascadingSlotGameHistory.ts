import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import CascadingSlotHistoryItem from "./CascadingSlotHistoryItem";
import CascadingSlotTicketDetail from "./CascadingSlotTicketDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSlotGameHistory extends SocketIOGameHistoryBase {
    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;
    betLogs: any;

    onLoad() {
        this.betLogs = [
            {
                time: "2022-03-15T04:16:02.382Z",
                id: 4999280,
                betLevel: 5,
                coinValue: 0.1,
                totalAmount: 10,
                totalTumbleWin: 70,
                freeSpin: false,
                settlementResult: {
                    tumbles: [
                        {
                            icons: { "8": { count: 10, odds: 3 } },
                            win: 30,
                            originalBoard: "8,8,8,3,8,9,8,8,8,9,5,9,8,10,10,9,5,8,10,11,10,6,11,8,10,11,11,6,11,7",
                            newBoard: "4,5,9,3,9,10,9,9,9,9,5,3,1,4,10,9,5,9,2,3,2,5,7,9,2,1,1,6,3,7"
                        }
                    ],
                    totalMultipliers: {
                        // nếu là freespin
                        rounds: [
                            {
                                time: "2022/04/12",
                                roundId: 123,
                                prevTotalMultiplier: 0,
                                totalMultiplier: 2,
                                multiplier: 2
                            },
                            {
                                time: "2022/04/12",
                                roundId: 125,
                                prevTotalMultiplier: 2,
                                totalMultiplier: 5,
                                multiplier: 3
                            }
                        ]
                    }
                }
            }
        ];
        this.bindItemRowData(this.betLogs[0], 1);
    }

    showTicketDetail(data: any) {
        const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        const ticketDetailComponent = ticketDetailPrefab.getComponent(CascadingSlotTicketDetail);

        this.node.addChild(ticketDetailPrefab);
        ticketDetailComponent.setData(data);
    }

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(CascadingSlotHistoryItem);
        item.setData(betLog, index);
        item.showTicketDetail = (log) => {
            this.showTicketDetail(log);
        };
        this.content.addChild(itemNode);
    }
}
