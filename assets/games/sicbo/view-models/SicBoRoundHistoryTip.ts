import MiniRoundHistoryTip from "../../../common/mini-round-history/MiniRoundHistoryTip";
import { SicBoBetType } from './SicBo';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoRoundHistoryTip extends MiniRoundHistoryTip {
    betChoices = {
        "small": "XỈU",
        "big": "TÀI",
        "anyTriple": "BỘ BA"
    }

    public setData(data: any) {
        this.roundId.string = `#${data.roundId}`;

        let result = "";

        if (data.settlementResult[SicBoBetType.anyTriple]) {
            result = this.betChoices[SicBoBetType.anyTriple];
        } else {
            if (data.settlementResult[SicBoBetType.big]) {
                result = this.betChoices[SicBoBetType.big];
            } else {
                result = this.betChoices[SicBoBetType.small];
            }
        }

        this.result.string = `${result} (${data.result.dice1}-${data.result.dice2}-${data.result.dice3})`;
        this.show();
    }
}
