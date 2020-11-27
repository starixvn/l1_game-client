const { ccclass, property } = cc._decorator;
import * as _ from "lodash";
import { numberWithCommas } from '../../../common/helpers/Helper';
import { SicBoBetType } from './SicBo';
import { getStringHourByTime } from '../../../common/helpers/Helper';

@ccclass
export default class SicBoTicketDetailItem extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    type: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    height: number = null;

    betTypes = {
        "small": "Tài/Xỉu",
        "big": "Tài/Xỉu",
        "anyTriple": "Bộ ba bất kỳ",
        "specific1": "Cược số",
        "specific2": "Cược số",
        "specific3": "Cược số",
        "specific4": "Cược số",
        "specific5": "Cược số",
        "specific6": "Cược số",
        "total4": "Tổng điểm",
        "total5": "Tổng điểm",
        "total6": "Tổng điểm",
        "total7": "Tổng điểm",
        "total8": "Tổng điểm",
        "total9": "Tổng điểm",
        "total10": "Tổng điểm",
        "total11": "Tổng điểm",
        "total12": "Tổng điểm",
        "total13": "Tổng điểm",
        "total14": "Tổng điểm",
        "total15": "Tổng điểm",
        "total16": "Tổng điểm",
        "total17": "Tổng điểm"
    };

    betChoices = {
        "small": "Xỉu",
        "big": "Tài",
        "anyTriple": "Bộ ba bất kỳ",
        "specific1": "1",
        "specific2": "2",
        "specific3": "3",
        "specific4": "4",
        "specific5": "5",
        "specific6": "6",
        "total4": "4",
        "total5": "5",
        "total6": "6",
        "total7": "7",
        "total8": "8",
        "total9": "9",
        "total10": "10",
        "total11": "11",
        "total12": "12",
        "total13": "13",
        "total14": "14",
        "total15": "15",
        "total16": "16",
        "total17": "17"
    }

    updateContent({time, choice, amount}, settlementResult) 
    {
        this.time.string = getStringHourByTime(time);
        this.type.string = this.betTypes[choice];
        this.choice.string = this.betChoices[choice];
        this.choice.node.color = settlementResult[choice] ? cc.Color.YELLOW : cc.Color.WHITE;
        this.amount.string = numberWithCommas(amount);
        this.amount.node.color = settlementResult[choice] ? cc.Color.YELLOW : cc.Color.WHITE;
        this.height = this.node.height;
    }
}
