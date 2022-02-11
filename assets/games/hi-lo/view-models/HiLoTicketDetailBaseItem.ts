import HiLoTicketDetailItem from "./HiLoTicketDetailItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoTicketDetailBaseItem extends HiLoTicketDetailItem {
    @property(cc.Label)
    round: cc.Label = null;

    setData(data: any, isFirst: boolean) {
        this.time = data.time;
        this.round.string = isFirst ? "Start Round" : "End Round";
        this.stake.string = data.stake;
        this.win.string = data.betwin;
    }
}
