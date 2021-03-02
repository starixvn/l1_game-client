import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import PaginationCommon from "../../../../common/helpers/Pagination/PaginationCommon";
import SocketIOGameHistoryBase from "../../../_base/view-models/SocketIOGameHistoryBase";
import Keno from "../Keno";
import KenoRoundResult from "./KenoRoundResult";
import KenoUserHistoryItem from "./KenoUserHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoProUserHistory extends SocketIOGameHistoryBase {
    @property(cc.Prefab)
    prefabRoundResult: cc.Prefab = null;
    private roundResult: KenoRoundResult = null;
    private readonly dataObserverKey = "KenoUserHistory";

    onEnable() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
        this.get_data();
    }

    receivedData(data) {
        if (data.kenoProMax && data.kenoProMax.history) {
            this.onData(data.kenoProMax.history);
        }
    }

    onDisable() {
        this.content.children.forEach((child) => child.destroy());
        cc.RedT.removeDataObserver(this.dataObserverKey);
    }

    bindItemRowData(betLog, index) {
        betLog.forEach((data: any) => {
            const historyItemPrefab = cc.instantiate(this.itemPrefab);
            const item = historyItemPrefab.getComponent("KenoUserHistoryItem") as KenoUserHistoryItem;
            item.init(this);
            item.node.active = true;
            item.time.string = getStringDateByTime(data.time);
            item.roundId = data.phien;
            item.round.string = data.phien;
            item.win.string = numberWithCommas(data.betwin);
            item.win.node.color = data.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

            let total = 0;
            const result = data.result;
            result.forEach((item) => {
                total += item;
            });

            const settlementResult = data.settlementResult;
            item.settlementResult = settlementResult;
            Object.keys(settlementResult).forEach((key) => {
                if (settlementResult[key]) {
                    item[key].node.color = cc.Color.YELLOW;
                }
            });

            item.total.string = total.toString();
            item.big.string = numberWithCommas(data.big);
            item.small.string = numberWithCommas(data.small);
            item.odd.string = numberWithCommas(data.odd);
            item.even.string = numberWithCommas(data.even);
            item.gold.string = numberWithCommas(data.gold);
            item.wood.string = numberWithCommas(data.wood);
            item.water.string = numberWithCommas(data.water);
            item.fire.string = numberWithCommas(data.fire);
            item.earth.string = numberWithCommas(data.earth);

            item.totalResult = total;
            item.result = result;

            this.content.addChild(historyItemPrefab);
        });
    }

    // get_data(page = 1) {
    //     cc.RedT.send({ g: { kenoProMax: { viewlogs: { page: page } } } });
    // }

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
