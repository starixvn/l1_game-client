const { ccclass, property } = cc._decorator;
import * as Pagination from '../../../../common/helpers/Pagination/Pagination';
import { numberWithCommas, getStringDateByTime, nFormatter } from '../../../common/helpers/Helper';
import RouletteTicketDetail from './RouletteTicketDetail';
import RouletteHistoryItem from './RouletteHistoryItem';

@ccclass
export default class RouletteHistory extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    private ticketDetail: RouletteTicketDetail = null;

    historyData = {
        "betLogs": [
            {
                "phien": 777,
                "betwin": 3,
                "corner": {
                    "28-29-31-32": 2
                },
                "dozen": {
                    "2": 2,
                    "3": 1
                },
                "name": "pikachu",
                "split": {
                    "29-32": 2
                },
                "straightUp": {
                    "25": 1,
                    "26": 1,
                    "31": 1,
                    "32": 1
                },
                "time": "2020-08-06T06:57:42.934Z",
                "totalAmount": 11,
                "result": 30,
                "settlementResult": {
                    "straightUp": ["30"],
                    "split": ["27-30", "29-30", "30-33"],
                    "street": ["28-29-30"],
                    "triangle": [],
                    "corner": ["26-27-29-30", "29-30-32-33"],
                    "fourNumbers": [],
                    "line": ["25-26-27-28-29-30", "28-29-30-31-32-33"],
                    "column": ["3"],
                    "dozen": ["3"],
                    "redBlack": ["red"],
                    "oddEven": ["even"],
                    "bigSmall": ["big"]
                },
                "betLogDetails": [
                    {
                        "time": "2020-08-06T06:57:42.934Z",
                        "straightUp": {
                            "25": 1,
                            "26": 1,
                            "31": 1,
                            "32": 1
                        },
                        "dozen": {
                            "2": 2,
                            "3": 1
                        },
                        "split": {
                            "29-32": 2
                        },
                        "corner": {
                            "28-29-31-32": 2
                        },
                        "__v": 0
                    }
                ]
            }
        ],
        "page": 1,
        "pageSize": 8,
        "total": 1
    }

    onLoad() {
        this.pages.init(this);
        this.onData(this.historyData.betLogs);
    }

    onData(data: any) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.children.forEach(child => child.destroy());

        data.forEach(log => {
            const historyItemPrefab = cc.instantiate(this.itemPrefab);
            const item = historyItemPrefab.getComponent(RouletteHistoryItem);
            this.content.addChild(historyItemPrefab);

            item.timeLabel.string = getStringDateByTime(log.time);
            item.roundLabel.string = log.phien.toString();
            item.resultLabel.string = log.result.toString();
            item.amountLabel.string = numberWithCommas(log.totalAmount);
            item.winLabel.string = numberWithCommas(log.betwin);
            item.winLabel.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

            item.time = '';
            item.round = log.phien;
            item.result = log.result;
            item.betLogDetails = log.betLogDetails;
            item.settlementResult = log.settlementResult;

            item.showTicketDetail = (round, time, result, betLogDetails, settlementResult) => {
                this.showTicketDetail(round, time, result, betLogDetails, settlementResult)
            }
        });
    }

    showTicketDetail(round: number, time: string, result: number, betLogDetails: any, settlementResult: any) {
        const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        this.ticketDetail = ticketDetailPrefab.getComponent(RouletteTicketDetail);

        this.node.addChild(ticketDetailPrefab);
        this.ticketDetail.roundLabel.string = round.toString();
        this.ticketDetail.resultLabel.string = result.toString();
        this.ticketDetail.setData(betLogDetails, settlementResult);
        this.ticketDetail.showbetLogs();
    }

    public hideTicketDetail() {
        this.ticketDetail = null;
    }
}
