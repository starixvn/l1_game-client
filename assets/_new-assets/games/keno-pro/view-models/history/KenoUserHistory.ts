const { ccclass, property } = cc._decorator;
import * as Pagination from '../../../../common/helpers/Pagination/Pagination'
import Keno from '../Keno';
import KenoUserHistoryItem from './KenoUserHistoryItem';
import { numberWithCommas, getStringDateByTime, nFormatter } from '../../../../common/helpers/Helper';


@ccclass
export default class KenoUserHistory extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    private root: Keno;

    init(root: Keno) {
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

    onData(data: any) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.children.forEach(child => child.destroy());

        for (let i = 0; i < data.betLogs.length; i++) {
            var dataT = data.betLogs[i];
            if (void 0 !== dataT) {
                let historyItemPrefab = cc.instantiate(this.prefabItem);
                let item = historyItemPrefab.getComponent("KenoUserHistoryItem") as KenoUserHistoryItem;
                item.node.active = true
                item.time.string = getStringDateByTime(dataT.time);
                item.round.string = dataT.phien;
                item.win.string = numberWithCommas(dataT.betwin);
                item.win.node.color = dataT.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;

                let total = 0;
                const result = dataT.result;
                for (let i = 0; i < result.length; i++) {
                    total += result[i];
                };
                item.total.string = numberWithCommas(total);

                this.content.addChild(historyItemPrefab);
            }
        }
    }

    get_data(page = 1) {
        this.root.sendData({ viewlogs: { page: page } });
    }

}
