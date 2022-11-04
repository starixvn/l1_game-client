const { ccclass, property } = cc._decorator;

@ccclass
export default class FanTanHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Label)
    result: cc.Label = null;

    setData(data: any, index: number) {
        const { time, roundId, stake, win } = data;
        this.time.string = time;
        this.roundId.string = roundId;
        this.stake.string = stake;
        this.win.string = win;
    }
}
