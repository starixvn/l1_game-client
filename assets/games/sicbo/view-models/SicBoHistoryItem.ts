import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoHistoryItem extends cc.Component {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Sprite)
    dices: cc.Sprite[] = [];

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Label)
    amountLabel: cc.Label = null;

    @property(cc.Label)
    winLabel: cc.Label = null;

    @property(cc.Node)
    bg: cc.Node = null;

    time: string = null;
    round: number = null;
    result: object = {};
    winning: number = null;
    amount: number = null;
    betLogDetails: any = null;
    settlementResult: any = null;

    public showTicketDetail = (round: number, time: string, result: any, betLogDetails: any, settlementResult: any) => {};

    openTicketDetail() {
        this.showTicketDetail(this.round, this.time, this.result, this.betLogDetails, this.settlementResult);
    }

    setData(betLog: any, dicesSpriteFrames: cc.SpriteFrame[], index: number) {
        this.timeLabel.string = getStringDateByTime(betLog.time);
        this.roundLabel.string = betLog.phien.toString();
        this.dices[0].spriteFrame = dicesSpriteFrames[betLog.result.dice1 - 1];
        this.dices[1].spriteFrame = dicesSpriteFrames[betLog.result.dice2 - 1];
        this.dices[2].spriteFrame = dicesSpriteFrames[betLog.result.dice3 - 1];
        this.total.string = betLog.result.dice1 + betLog.result.dice2 + betLog.result.dice3;
        this.bg.active = index % 2 > 0;
    }
}
