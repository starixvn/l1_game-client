import * as i18n from "i18n/runtime-scripts/LanguageData";

import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import PaginationCommon from "../../../../common/helpers/Pagination/PaginationCommon";
import BetHistory from "../../../_new/common/BetHistory";
import { events } from "../../../_new/connection/SocketIOConnection";
import TexasHoldemPoker from "../texas-holdem-poker";
import TexasTicketDetail from "./texas-ticket-detail";
import TexasTicketHistoryItem from "./texas-ticket-history-item";

const { ccclass, property, menu } = cc._decorator;
export interface BetLog {
    dealerHandId: number;
    playerHandId: number;
    isFold: boolean;
    roundId: number;
    stake: number;
    time: Date;
    betWin: number;
    isQualified: boolean;
    isPlayerWin: number;
}

type HistoryDataType = {
    history: {
        page: number;
        pageSize: number;
        total: number;
        betLogs: BetLog[];
    };
};
@ccclass
export default class TexasTicketHistory extends BetHistory {
    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    historyData: BetLog[] = null;

    private root: TexasHoldemPoker;
    private ticketDetailComponent: TexasTicketDetail = null;

    protected handRanking = {
        1: i18n.t("texasPoker.highCard"),
        2: i18n.t("texasPoker.pair"),
        3: i18n.t("texasPoker.twoPairs"),
        4: i18n.t("texasPoker.threeKind"),
        5: i18n.t("texasPoker.straight"),
        6: i18n.t("texasPoker.flush"),
        7: i18n.t("texasPoker.fullHouse"),
        8: i18n.t("texasPoker.fourKind"),
        9: i18n.t("texasPoker.straightFlush"),
        10: i18n.t("texasPoker.royalFlush"),
        11: i18n.t("texasPoker.fold")
    };

    init(root: TexasHoldemPoker) {
        this.root = root;
    }

    onLoad() {
        this.pages.init(this);
    }

    showDialog() {
        const commonDialog = this.getComponent(CommonDialog);
        if (commonDialog) {
            this.get_data();
            commonDialog.showDialog();
        }
    }

    getHistory(page: number = 1) {
        this.connection.emit(events.getHistory, { page });
    }

    getTicketDetail(roundId: number = 1) {
        this.connection.emit(events.getTicketDetail, { roundId });
    }

    get_data(page = 1) {
        this.getHistory(page);
    }

    onData(data: HistoryDataType) {
        if (!data.history) {
            return;
        }
        this.historyData = data.history.betLogs;

        this.pages.onSet(data.history.page, data.history.pageSize, data.history.total);
        this.content.children.forEach((child) => child.destroy());

        this.historyData.forEach((log) => {
            this.initItem(log);
        });
    }

    initItem(log: BetLog) {
        const historyItemPrefab = cc.instantiate(this.prefabItem);
        const item = historyItemPrefab.getComponent(TexasTicketHistoryItem);
        this.content.addChild(historyItemPrefab);

        item.time.string = getStringDateByTime(log.time);
        item.round.string = log.roundId.toString();
        item.win.string = numberWithCommas(log.betWin);
        if (!log.isFold) {
            item.player.string = this.handRanking[log.playerHandId].toUpperCase();
            item.dealer.string = this.handRanking[log.dealerHandId].toUpperCase();
            if (log.isPlayerWin >= 0) {
                item.player.node.color = item.time.node.color = cc.Color.YELLOW;
            } else {
                item.dealer.node.color = cc.Color.YELLOW;
            }
        } else {
            item.player.string = this.handRanking[11].toUpperCase();
            item.dealer.node.color = cc.Color.YELLOW;
            item.dealer.string = "-";
        }

        item.stake.string = numberWithCommas(log.stake);
        item.win.node.color = log.betWin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
        item.openTicketDetail = () => {
            this.root.playClick();
            this.getTicketDetail(log.roundId);
            this.initTicketDetail(log.roundId, log.time);
        };
    }

    private initTicketDetail(roundId: number, time: Date) {
        const ticketDetail = this.node.getChildByName(this.ticketDetailPrefab.name);
        if (ticketDetail) {
            ticketDetail.removeFromParent(true);
            ticketDetail.destroy();
        }

        const ticketDetailNode = cc.instantiate(this.ticketDetailPrefab);
        this.ticketDetailComponent = ticketDetailNode.getComponent(TexasTicketDetail);

        this.ticketDetailComponent.renderTitle(roundId, time);
        this.node.addChild(ticketDetailNode);
    }

    public showTicketDetail(data) {
        this.ticketDetailComponent.renderBets(data);
        this.ticketDetailComponent.renderCards(data, this.handRanking);
    }
}
