import { MiniKenoProVietRound } from "./MiniKenoProVietRoundsSelection";
import * as moment from 'moment';
import MiniKenoProViet from "../MiniKenoProViet";
import { zeroPad } from '../../../../common/helpers/Helper.js';


const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoProVietRoundItem extends cc.Component {
    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    roundTime: cc.Label = null;

    @property(cc.Label)
    roundDate: cc.Label = null;

    @property(cc.Node)
    hasBet: cc.Node = null;

    public round: MiniKenoProVietRound;
    public fullDate: string;

    setData(round: MiniKenoProVietRound) {
        this.round = round;
        this.roundId.string = "#" + zeroPad(round.id, 7);
        const timeMoment = moment(round.time);
        this.roundTime.string = timeMoment.format(MiniKenoProViet.TIME_FORMAT);
        this.roundDate.string = timeMoment.format(MiniKenoProViet.DATE_FORMAT);
        this.fullDate = timeMoment.format(MiniKenoProViet.FULL_DATE_FORMAT);
        this.hasBet.active = round.hasBet;
        this.roundTime.node.color = this.roundDate.node.color = this.roundId.node.color = round.hasBet ? cc.Color.WHITE : cc.Color.BLACK;
    }
}
