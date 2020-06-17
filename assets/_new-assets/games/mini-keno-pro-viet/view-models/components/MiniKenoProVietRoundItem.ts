import { MiniKenoProVietRound } from "./MiniKenoProVietRoundsSelection";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoProVietRoundItem extends cc.Component {
    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    roundTime: cc.Label = null;

    @property(cc.Label)
    roundDate: cc.Label = null;

    public id: string;

    setData(round: MiniKenoProVietRound) {
        this.id = round.id;
        this.roundId.string = "#" + round.id;
        const dateTime = new Date(round.time);

        this.roundTime.string = dateTime.getHours() + ":" + dateTime.getMinutes();
        this.roundDate.string = dateTime.getDay() + "/" + dateTime.getMonth();
    }
}
