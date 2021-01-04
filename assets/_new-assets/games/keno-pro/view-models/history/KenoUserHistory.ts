import { getStringDateByTime, numberWithCommas } from "../../../../common/helpers/Helper";
import PaginationCommon from "../../../../common/helpers/Pagination/PaginationCommon";
import Keno from "../Keno";
import KenoRoundResult from "./KenoRoundResult";
import KenoUserHistoryItem from "./KenoUserHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoUserHistory extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(cc.Prefab)
    prefabRoundResult: cc.Prefab = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    private readonly root: Keno;
    private roundResult: KenoRoundResult = null;
    private readonly dataObserverKey = "KenoUserHistory";

    onLoad() {
        this.pages.init(this);

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

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

    public onData(data: any) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.children.forEach((child) => child.destroy());

        for (let i = 0; i < data.betLogs.length; i++) {
            var dataT = data.betLogs[i];
            if (void 0 !== dataT) {
                const historyItemPrefab = cc.instantiate(this.prefabItem);
                const item = historyItemPrefab.getComponent("KenoUserHistoryItem") as KenoUserHistoryItem;
                item.init(this);
                item.node.active = true;
                item.time.string = getStringDateByTime(dataT.time);
                item.roundId = dataT.phien;
                item.round.string = dataT.phien;
                item.win.string = numberWithCommas(dataT.betwin);
                item.win.node.color = dataT.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

                let total = 0;
                const result = dataT.result;
                for (let i = 0; i < result.length; i++) {
                    total += result[i];
                }

                const settlementResult = dataT.settlementResult;
                item.settlementResult = settlementResult;
                Object.keys(settlementResult).forEach((key) => {
                    if (settlementResult[key]) {
                        item[key].node.color = cc.Color.YELLOW;
                    }
                });

                item.total.string = total.toString();
                item.big.string = numberWithCommas(dataT.big);
                item.small.string = numberWithCommas(dataT.small);
                item.odd.string = numberWithCommas(dataT.odd);
                item.even.string = numberWithCommas(dataT.even);
                item.gold.string = numberWithCommas(dataT.gold);
                item.wood.string = numberWithCommas(dataT.wood);
                item.water.string = numberWithCommas(dataT.water);
                item.fire.string = numberWithCommas(dataT.fire);
                item.earth.string = numberWithCommas(dataT.earth);

                item.totalResult = total;
                item.result = result;

                this.content.addChild(historyItemPrefab);
            }
        }
    }

    get_data(page = 1) {
        cc.RedT.send({ g: { kenoProMax: { viewlogs: { page: page } } } });
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
