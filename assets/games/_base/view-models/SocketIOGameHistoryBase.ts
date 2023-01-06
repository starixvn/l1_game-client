import { Socket } from "socket.io-client";

import { i18n } from "../../../ClientModules";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import BaseComponent from "../../../common/BaseComponent";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";
import HistoryFrame from "../../../common/new-history/HistoryFrame";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class SocketIOGameHistoryBase extends BaseComponent {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    wrapperContent: cc.Node = null;

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    public gameId = 0;

    public headerTitleColor = "#ffe800";

    historyFrame: HistoryFrame;
    pagination: PaginationCommon;
    mainFrame: cc.Node;
    gameName: cc.Label;

    protected socket: Socket;

    onUpdatedData = () => {};

    HEIGHT_CONTENT = 520;
    WIDTH_SIGN = 120;

    init(socket: Socket) {
        this.socket = socket;
    }

    onEnable() {
        this.get_data();
    }

    setGameName() {
        const dataId = `gameNames.${this.gameId}`;
        const gameName = ` - ${i18n.t(dataId)}`;
        this.gameName.string = gameName.toUpperCase();
        this.gameName.node.active = true;
    }

    start() {
        if (this.gameId != 0) {
            this.setGameName();
            const node = this.gameName.node.parent;
            node.getComponent(cc.Layout).updateLayout();
            this.historyFrame.updateTitleSize(node.width + this.WIDTH_SIGN);
        }
        //const header = this.wrapperContent.children[0];
    }

    get_data(page = 1) {
        this.socket && this.socket.connected && this.socket.emit("getHistory", { page: page });
    }

    onData(data) {
        const { page, pageSize, total, betLogs } = data;
        this.pagination.onSet(page, pageSize, total);
        this.content.destroyAllChildren();
        this.scrollView && this.scrollView.scrollToTop(0.1);

        if (!betLogs || !betLogs.length) {
            return;
        }

        betLogs.forEach((betLog, index) => this.bindItemRowData(betLog, index));
        this.onUpdatedData();
    }

    abstract bindItemRowData(betLog, index);

    handleSomeItemRowData(context: any, item: any, log: any) {
        item.amountLabel.string = numberWithCommas(log.totalAmount);
        item.winLabel.string = numberWithCommas(log.betwin, 2);
        item.winLabel.node.color = log.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

        item.time = "";
        item.round = log.phien;
        item.result = log.result;
        item.betLogDetails = log.betLogDetails;
        item.settlementResult = log.settlementResult;

        item.showTicketDetail = (round, time, result, betLogDetails, settlementResult) => {
            context.showTicketDetail(round, time, result, betLogDetails, settlementResult);
        };
    }

    initHistoryWrapper(node: cc.Node) {
        this.historyFrame = node.getComponent(HistoryFrame);
        this.pagination = this.historyFrame.pagination;
        this.mainFrame = this.historyFrame.backWrapper;
        this.gameName = this.historyFrame.gameName;
        const commonDialog = this.mainFrame.getComponent(CommonDialog);
        commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
        this.pagination.init(this);

        this.wrapperContent.parent = this.mainFrame;
        this.historyFrame.updateSizeFrame(this.content.width, this.HEIGHT_CONTENT);
    }
}
