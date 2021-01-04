import * as _ from "lodash";

import { getStringDateByTime, numberWithCommas } from "../../../common/helpers/Helper";
import PaginationCommon from "../../../common/helpers/Pagination/PaginationCommon";
import BaccaratHistoryItem from "../../baccarat/view-models/BaccaratHistoryItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VipBaccaratHistory extends cc.Component {
    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    private socket: SocketIOClient.Socket;

    init(socket: SocketIOClient.Socket) {
        this.socket = socket;
    }

    onLoad() {
        this.pages.init(this);

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

    onData(data: any) {
        const { page, pageSize, total, betLogs } = data;
        this.pages.onSet(page, pageSize, total);
        this.content.destroyAllChildren();

        if (betLogs && betLogs.length) {
            betLogs.forEach((betLog, index) => {
                const historyItemPrefab = cc.instantiate(this.prefabItem);
                const item = historyItemPrefab.getComponent(BaccaratHistoryItem);
                item.node.active = true;
                this.content.addChild(historyItemPrefab);

                const { time, phien, result, settlementResult, betwin } = betLog;

                item.time.string = getStringDateByTime(time);
                item.round.string = phien;
                item.win.string = numberWithCommas(betwin);
                item.win.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

                const playerCards = _.values(result.player);
                const bankerCards = _.values(result.banker);
                item.playerCards.init(null, false);
                item.bankerCards.init(null, false);
                item.playerCards.showCardsWithoutAnimation(playerCards);
                item.bankerCards.showCardsWithoutAnimation(bankerCards);

                const resultKeys = _.keys(settlementResult);

                _.forEach(resultKeys, (key) => {
                    const currentItem = item[key];
                    const isWin = settlementResult[key];

                    if (currentItem) {
                        currentItem.node.color = isWin ? cc.Color.YELLOW : cc.Color.WHITE;
                        currentItem.string = numberWithCommas(betLog[key]);
                    }
                });
            });
        }
    }
}
