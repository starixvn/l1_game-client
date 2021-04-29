import { getStringDateByTime } from '../../../../common/helpers/DateTimeHelper';
import { numberWithCommas } from '../../../../common/helpers/NumberHelper';
import NewCard from '../../../../common/new-card/view-models/NewCard';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property({ type: NewCard })
    cards: NewCard[] = [];

    @property(cc.Label)
    betDragon: cc.Label = null;

    @property(cc.Label)
    betTiger: cc.Label = null;

    @property(cc.Label)
    betDraw: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    setData(betLog: any) {
        this.node.active = true;
        this.time.string = getStringDateByTime(betLog.time);
        this.round.string = betLog.phien;
        this.win.string = numberWithCommas(betLog.betwin);
        this.win.node.color = betLog.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

        const result = betLog.result;
        this.cards[0].setCardOldStyle({
            rank: result.dragon.card,
            suit: result.dragon.type
        });
        this.cards[1].setCardOldStyle({
            rank: result.tiger.card,
            suit: result.tiger.type
        });
        this.cards.forEach((card) => {
            card.faceUp();
        });

        this.betDragon.string = numberWithCommas(betLog.dragon);
        this.betTiger.string = numberWithCommas(betLog.tiger);
        this.betDraw.string = numberWithCommas(betLog.tie);

        const settlementResult = betLog.settlementResult;
        if (settlementResult.dragon) {
            this.betDragon.node.color = cc.Color.YELLOW;
        } else if (settlementResult.tiger) {
            this.betTiger.node.color = cc.Color.YELLOW;
        } else {
            this.betDraw.node.color = cc.Color.YELLOW;
        }
    }
}
