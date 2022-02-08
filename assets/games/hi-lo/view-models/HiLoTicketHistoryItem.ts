const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    renderTicketItem(time: string, id: number, amount: number, betwin: number) {
        this.time.string = time;
        this.roundId.string = id.toString();
        this.stake.string = amount.toString();
        this.win.string = betwin.toString();
    }
}
