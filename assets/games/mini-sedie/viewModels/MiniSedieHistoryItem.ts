import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import SedieHistoryItemBase from "../../_base/view-models/SedieHistoryItemBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedieHistoryItem extends SedieHistoryItemBase {
    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    even: cc.Label = null;

    @property(cc.Label)
    red3: cc.Label = null;

    @property(cc.Label)
    red4: cc.Label = null;

    @property(cc.Label)
    white3: cc.Label = null;

    @property(cc.Label)
    white4: cc.Label = null;

    setData(betLog: any) {
        const { settlementResult } = betLog;

        Object.keys(settlementResult).forEach((choice) => {
            this[choice].string = numberWithCommas(betLog[choice]);
            if (settlementResult[choice]) {
                this[choice].node.color = cc.Color.YELLOW;
            } else {
                this[choice].node.color = cc.Color.WHITE;
            }
        });
    }
}
