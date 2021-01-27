import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";
import GameHistoryBase from "../../_base/GameHistoryBase";
import RouletteBase from "./RouletteBase";
import RouletteHistoryItem from "./RouletteHistoryItem";
import RouletteTicketDetail from "./RouletteTicketDetail";

const { ccclass, property } = cc._decorator;
@ccclass
export default class RouletteHistory extends RouletteBase {
    @property(cc.Node)
    content: cc.Node = null;

    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    historyData: any = null;
    dataObserverKey = "RouletteHistory";

    onLoad() {
        this.pages.init(this);
        super.onLoad();
    }

    receivedData(data) {
        if (data["roulette"] && data["roulette"].history) {
            this.onData(data["roulette"].history);
        }
    }

    get_data(page = 1) {
        cc.RedT.send({ g: { ["roulette"]: { getHistory: { page: page } } } });
    }

    onData(data: any) {
        this.historyData = data.betLogs;
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.children.forEach((child) => child.destroy());

        this.historyData.forEach((log) => {
            const historyItemPrefab = cc.instantiate(this.itemPrefab);
            const item = historyItemPrefab.getComponent(RouletteHistoryItem);
            this.content.addChild(historyItemPrefab);

            item.timeLabel.string = getStringDateByTime(log.time);
            item.roundLabel.string = log.phien.toString();
            item.resultLabel.string = log.result.toString();

            GameHistoryBase.handleSomeItemRowData(this, item, log);
        });
    }

    showTicketDetail(round: number, time: string, result: number, betLogDetails: any, settlementResult: any) {
        const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        const ticketDetailComponent = ticketDetailPrefab.getComponent(RouletteTicketDetail);

        this.node.addChild(ticketDetailPrefab);
        ticketDetailComponent.roundLabel.string = round.toString();
        ticketDetailComponent.resultLabel.string = result.toString();
        ticketDetailComponent.setData(betLogDetails, settlementResult);
        ticketDetailComponent.showbetLogs();
    }
}
