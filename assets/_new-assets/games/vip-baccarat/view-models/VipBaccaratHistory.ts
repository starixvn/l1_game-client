import * as _ from "lodash";

import { getStringDateByTime, numberWithCommas } from "../../../common/helpers/Helper";
import NewSocketGameBaseHistory from "../../_base/NewSocketGameBaseHistory";
import BaccaratHistoryItem from "../../baccarat/view-models/BaccaratHistoryItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VipBaccaratHistory extends NewSocketGameBaseHistory {
    bindItemRowData(betLog, index) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
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
    }
}
