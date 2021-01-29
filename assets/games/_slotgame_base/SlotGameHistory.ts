import { numberWithCommas } from "./../../common/helpers/NumberHelper";
import { getStringDateByTime } from "./../../common/helpers/DateTimeHelper";
import PaginationCommon from "./../../common/helpers/Pagination/PaginationCommon";
import SlotGameHistoryItem from "./SlotGameHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameHistory extends cc.Component {
    @property(PaginationCommon)
    pagination: PaginationCommon = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    private socket: SocketIOClient.Socket;

    init(socket: SocketIOClient.Socket) {
        this.socket = socket;
    }

    onLoad() {
        this.pagination.init(this);

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    onEnable() {
        this.get_data();
    }

    get_data(page = 1) {
        this.socket && this.socket.connected && this.socket.emit("getHistory", { page: page });
    }

    onData(data) {
        const { page, pageSize, total, betLogs } = data;
        this.pagination.onSet(page, pageSize, total);
        this.content.destroyAllChildren();

        if (betLogs && betLogs.length) {
            betLogs.map((betLog, index) => {
                const itemNode = cc.instantiate(this.itemPrefab);
                const item = itemNode.getComponent(SlotGameHistoryItem);
                let win = betLog.betWin;

                if (betLog.settlementResult.jackpot !== null) {
                    win += betLog.settlementResult.jackpot.winningAmount;
                    item.jackpotIcon.active = true;
                }

                item.node.active = true;
                item.bg.active = index % 2 > 0;
                item.time.string = getStringDateByTime(betLog.time);
                item.roundID.string = betLog.id;
                item.payLines.string = betLog.paylines.length;
                item.bet.string = numberWithCommas(betLog.bet);
                item.totalAmount.string = betLog.freeSpin ? 0 : numberWithCommas(betLog.totalAmount);
                item.win.string = numberWithCommas(win);
                item.data = betLog;

                const highlightColor = win <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

                item.time.node.color = highlightColor;
                item.payLines.node.color = highlightColor;
                item.bet.node.color = highlightColor;
                item.win.node.color = highlightColor;

                item.showTicketDetail = (log) => {
                    this.showTicketDetail(log);
                };
                this.content.addChild(itemNode);
            });
        }
    }

    showTicketDetail(data: any) {}
}
