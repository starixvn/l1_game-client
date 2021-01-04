import { getStringDateByTime, numberWithCommas } from "../../../common/helpers/Helper";
import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";
import RouletteHistoryItem from "./RouletteHistoryItem";
import RouletteTicketDetail from "./RouletteTicketDetail";

const { ccclass, property } = cc._decorator;
@ccclass
export default class RouletteHistory extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    historyData: any = null;
    private readonly dataObserverKey = "RouletteHistory";

    onLoad() {
        this.pages.init(this);
        this.get_data();
        this.addDataObserver();

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    addDataObserver() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
    }

    onDestroy() {
        this.removeDataObserver();
    }

    removeDataObserver() {
        cc.RedT.removeDataObserver(this.dataObserverKey);
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
            item.amountLabel.string = numberWithCommas(log.totalAmount);
            item.winLabel.string = numberWithCommas(log.betwin);
            item.winLabel.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

            item.time = "";
            item.round = log.phien;
            item.result = log.result;
            item.betLogDetails = log.betLogDetails;
            item.settlementResult = log.settlementResult;

            item.showTicketDetail = (round, time, result, betLogDetails, settlementResult) => {
                this.showTicketDetail(round, time, result, betLogDetails, settlementResult);
            };
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
