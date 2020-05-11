const { ccclass, property } = cc._decorator;
import * as Pagination from '../../../../common/helpers/Pagination/Pagination'
import Keno from '../Keno';
import KenoUserHistoryItem from './KenoUserHistoryItem';
import { numberWithCommas, getStringDateByTime, nFormatter } from '../../../../common/helpers/Helper';
import KenoRoundResult from './KenoRoundResult';


@ccclass
export default class KenoUserHistory extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(cc.Prefab)
    prefabRoundResult: cc.Prefab = null;

    private root: Keno;
    private roundResult: KenoRoundResult = null;

    public init(root: Keno) {
        this.root = root;
    }

    onLoad() {
        this.pages.init(this);
    }

    onEnable() {
        this.get_data();
    }

    onDisable() {
        this.root.hideHistoryDialog();
        this.content.children.forEach(child => child.destroy());
        this.node.destroy();
    }

    public onData(data: any) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.children.forEach(child => child.destroy());

        for (let i = 0; i < data.betLogs.length; i++) {
            var dataT = data.betLogs[i];
            if (void 0 !== dataT) {
                let historyItemPrefab = cc.instantiate(this.prefabItem);
                let item = historyItemPrefab.getComponent("KenoUserHistoryItem") as KenoUserHistoryItem;
                item.init(this);
                item.node.active = true
                item.time.string = getStringDateByTime(dataT.time);
                item.roundId = dataT.phien;
                item.round.string = dataT.phien;
                item.win.string = numberWithCommas(dataT.betwin);
                item.win.node.color = dataT.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

                let total = 0;
                const result = dataT.result;
                for (let i = 0; i < result.length; i++) {
                    total += result[i];
                };
                item.total.string = numberWithCommas(total);
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
        this.root.sendData({ viewlogs: { page: page } });
    }

    public showRoundResult(round: number, total: number, result: number[]) {
        let dialog = cc.instantiate(this.prefabRoundResult);
        this.roundResult = dialog.getComponent("KenoRoundResult");
        this.roundResult.total.string = numberWithCommas(total);
        this.roundResult.result = result;
        this.node.addChild(dialog);
    }

    public hideRoundResult() {
        this.roundResult = null;
    }
}
