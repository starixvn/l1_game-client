import * as i18n from "i18n/runtime-scripts/LanguageData";

import CommonDialog from "../../../../common/_base/view-models/CommonDialog";
import AudioManager from "../../../../common/audio/AudioManager";
import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import PaginationCommon from "../../../../common/helpers/Pagination/PaginationCommon";
import BetHistory from "../../../_new/common/BetHistory";
import { events } from "../../../_new/connection/SocketIOConnection";
import HoldemPoker from "../HoldemPoker";
import HoldemPokerTicketDetail from "./HoldemPokerTicketDetail";
import HoldemPokerTicketHistoryItem from "./HoldemPokerTicketHistoryItem";

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

export const HandResultConst = {
    0: "doesNotQualify",
    1: "highCards",
    2: "onePair",
    3: "twoPairs",
    4: "threeKind",
    5: "straight",
    6: "flush",
    7: "fullHouse",
    8: "fourOfAKind",
    9: "straightFlush",
    10: "royalFlush"
};

@ccclass
@menu("Games/HolemPoker/HoldemPokerTicketHistory")
export default class HoldemPokerTicketHistory extends BetHistory {
    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property([cc.SpriteFrame])
    cardTypes: Array<cc.SpriteFrame> = [];

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    historyData: BetLog[] = null;

    private root: HoldemPoker;
    private ticketDetailComponent: HoldemPokerTicketDetail = null;

    init(root: HoldemPoker) {
        this.root = root;
    }

    onLoad() {
        this.pages.init(this);
        const commonDialog = this.getComponent(CommonDialog);
        commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
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
        let index = 0;
        if (!data.history) {
            return;
        }
        this.historyData = data.history.betLogs;

        this.pages.onSet(data.history.page, data.history.pageSize, data.history.total);
        this.content.children.forEach((child) => child.destroy());

        this.historyData.forEach((log) => {
            this.initItem(log, index);
            index++;
        });
    }

    initItem(log: BetLog, index: number) {
        const historyItemPrefab = cc.instantiate(this.prefabItem);
        const item = historyItemPrefab.getComponent(HoldemPokerTicketHistoryItem);
        this.content.addChild(historyItemPrefab);

        item.time.string = getStringDateByTime(log.time);
        item.round.string = log.roundId.toString();
        item.win.string = numberWithCommas(log.betWin);
        item.showBg.active = index % 2 == 0 ? false : true;
        if (!log.isFold) {
            const resultPlayer = `holdEmPoker.${HandResultConst[log.playerHandId]}`;
            item.player.string = `${i18n.t(resultPlayer)}`.toUpperCase();
            let dealerResult: string;
            if (log.isQualified) {
                dealerResult = `holdEmPoker.${HandResultConst[log.dealerHandId]}`;
                if (log.isPlayerWin >= 0) {
                    item.player.node.color = cc.Color.YELLOW;
                } else {
                    item.dealer.node.color = cc.Color.YELLOW;
                }
            } else {
                item.player.node.color = cc.Color.YELLOW;
                dealerResult = `holdEmPoker.${HandResultConst[0]}`;
            }
            item.dealer.string = `${i18n.t(dealerResult)}`.toUpperCase();
        } else {
            item.player.string = `${i18n.t(`holdEmPoker.fold`)}`;
            item.dealer.node.color = cc.Color.YELLOW;
            item.dealer.string = "-";
        }

        item.stake.string = numberWithCommas(log.stake);
        item.win.node.color = log.betWin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
        item.openTicketDetail = () => {
            AudioManager.getInstance().playClick();
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
        const ticketDetailPrefab = cc.instantiate(this.ticketDetailPrefab);
        this.ticketDetailComponent = ticketDetailPrefab.getComponent(HoldemPokerTicketDetail);
        this.ticketDetailComponent.renderTitle(roundId, time);
        this.root.currentMiniPanel.addDialog(ticketDetailPrefab);
    }

    public showTicketDetail(data) {
        this.ticketDetailComponent.renderBets(data);
        this.ticketDetailComponent.renderCards(data);
    }
}
