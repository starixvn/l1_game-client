import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import SocketIOGameHistoryBase from "../../../_base/view-models/SocketIOGameHistoryBase";
import KenoRoundResult from "./KenoRoundResult";
import KenoUserHistoryItem from "./KenoUserHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoUserHistory extends SocketIOGameHistoryBase {
    @property(cc.Prefab)
    prefabRoundResult: cc.Prefab = null;
    private roundResult: KenoRoundResult = null;

    bindItemRowData(betLog, index) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
        const item = historyItemPrefab.getComponent("KenoUserHistoryItem") as KenoUserHistoryItem;
        item.init(this);
        item.node.active = true;
        item.time.string = getStringDateByTime(betLog.time);
        item.roundId = betLog.phien;
        item.round.string = betLog.phien;
        item.win.string = numberWithCommas(betLog.betwin);
        item.win.node.color = betLog.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

        let total = 0;
        const result = betLog.result;
        result.forEach((item) => {
            total += item;
        });

        const settlementResult = betLog.settlementResult;
        item.settlementResult = settlementResult;
        Object.keys(settlementResult).forEach((key) => {
            if (settlementResult[key]) {
                item[key].node.color = cc.Color.YELLOW;
            }
        });

        item.total.string = total.toString();
        item.big.string = numberWithCommas(betLog.big);
        item.small.string = numberWithCommas(betLog.small);
        item.odd.string = numberWithCommas(betLog.odd);
        item.even.string = numberWithCommas(betLog.even);
        item.gold.string = numberWithCommas(betLog.gold);
        item.wood.string = numberWithCommas(betLog.wood);
        item.water.string = numberWithCommas(betLog.water);
        item.fire.string = numberWithCommas(betLog.fire);
        item.earth.string = numberWithCommas(betLog.earth);

        item.totalResult = total;
        item.result = result;

        this.content.addChild(historyItemPrefab);
    }

    public showRoundResult(round, total: number, result: number[], settlementResult: any) {
        const dialog = cc.instantiate(this.prefabRoundResult);
        this.roundResult = dialog.getComponent("KenoRoundResult");
        this.roundResult.round.string = round;
        this.node.addChild(dialog);
        this.roundResult.setData(result, settlementResult);
        this.roundResult.showResult();
    }

    public hideRoundResult() {
        this.roundResult = null;
    }
}
