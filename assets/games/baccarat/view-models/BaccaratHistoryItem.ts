import _ = require("lodash");
import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import BaccaratCards from "./BaccaratCards";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(BaccaratCards)
    playerCards: BaccaratCards = null;

    @property(BaccaratCards)
    bankerCards: BaccaratCards = null;

    @property(cc.Label)
    player: cc.Label = null;

    @property(cc.Label)
    banker: cc.Label = null;

    @property(cc.Label)
    tie: cc.Label = null;

    @property(cc.Label)
    playerPair: cc.Label = null;

    @property(cc.Label)
    bankerPair: cc.Label = null;

    @property(cc.Label)
    big: cc.Label = null;

    @property(cc.Label)
    small: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    setData(betLog: any, index: number) {
        const { time, phien, settlementResult, betwin } = betLog;

        this.time.string = getStringDateByTime(time);
        this.round.string = phien;
        this.win.string = numberWithCommas(betwin);
        this.win.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

        const resultKeys = _.keys(settlementResult);

        _.forEach(resultKeys, (key) => {
            const currentItem = this[key];
            const isWin = settlementResult[key];

            if (currentItem) {
                currentItem.node.color = isWin ? cc.Color.YELLOW : cc.Color.WHITE;
                currentItem.string = numberWithCommas(betLog[key]);
            }
        });
    }

    showCards(betLog: any) {
        const playerCards = _.values(betLog.result.player);
        const bankerCards = _.values(betLog.result.banker);
        this.playerCards.init(null, false);
        this.bankerCards.init(null, false);
        this.playerCards.showCardsWithoutAnimation(playerCards);
        this.bankerCards.showCardsWithoutAnimation(bankerCards);
    }
}
