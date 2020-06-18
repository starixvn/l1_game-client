import { MiniKenoProVietRound } from "./MiniKenoProVietRoundsSelection";
import * as moment from 'moment';


const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoProVietRoundItem extends cc.Component {
    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    roundTime: cc.Label = null;

    @property(cc.Label)
    roundDate: cc.Label = null;

    public round: MiniKenoProVietRound;
    public fullDate: string;

    setData(round: MiniKenoProVietRound) {
        this.round = round;
        this.roundId.string = "#" + round.id;
        const timeMoment = moment(round.time);
        this.roundTime.string = timeMoment.format('HH:mm');
        this.roundDate.string = timeMoment.format('DD/MM');
        this.fullDate = timeMoment.format('DD/MM/YYYY');
    }
}
