import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import SedieHistoryBase from "../../_base/view-models/SedieHistoryBase";
import MiniSedieHistoryItem from "./MiniSedieHistoryItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class MiniSedieHistory extends SedieHistoryBase {
    bindItemRowData(betLog, index) {
        const itemNode = this.bindCommonData(betLog, index);
        const item = itemNode.getComponent(MiniSedieHistoryItem);

        const { settlementResult } = betLog;

        Object.keys(settlementResult).forEach((choice) => {
            item[choice].string = numberWithCommas(betLog[choice]);
            if (settlementResult[choice]) {
                item[choice].node.color = cc.Color.YELLOW;
            } else {
                item[choice].node.color = cc.Color.WHITE;
            }
        });

        this.content.addChild(itemNode);
    }
}
