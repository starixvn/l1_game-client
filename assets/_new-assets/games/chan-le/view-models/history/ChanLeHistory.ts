const { ccclass, property } = cc._decorator;
import * as Pagination from '../../../../common/helpers/Pagination/Pagination'
import { numberWithCommas, getStringDateByTime } from '../../../../common/helpers/Helper';
import ChanLe from '../ChanLe';
import ChanLeHistoryItem from './ChanLeHistoryItem';

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    private root: ChanLe;

    init(root: ChanLe) {
        this.root = root;
    }

    onEnable() {
        this.pages.init(this);
        this.getHistoryData();
    }

    onDisable() {
        this.node.destroyAllChildren();
        this.node.destroy();
    }

    onData(historyData: any) {
        this.pages.onSet(historyData.page, historyData.kmess, historyData.total);
        this.content.removeAllChildren(true);

        for (var i = 0; i < 9; i++) {
            var historyItemData = historyData.data[i];
            var historyItemPrefab = cc.instantiate(this.itemPrefab);
            var historyItem = historyItemPrefab.getComponent("ChanLeHistoryItem") as ChanLeHistoryItem;

            if (historyItemData) {
                historyItem.node.active = true;
                var point = historyItemData.dice1 + historyItemData.dice2 + historyItemData.dice3;
                historyItem.time.string = getStringDateByTime(historyItemData.time);
                historyItem.turnId.string = historyItemData.phien;
                historyItem.betChoice.string = this.buildBetChoce(historyItemData.select);
                historyItem.result.string = historyItemData.dice1 + "-" + historyItemData.dice2 + "-" + historyItemData.dice3 + "  " + point;
                historyItem.betMoney.string = numberWithCommas(historyItemData.bet);
                historyItem.refund.string = numberWithCommas(historyItemData.tralai);
                historyItem.winMoney.string = numberWithCommas(historyItemData.betwin);
                historyItem.winMoney.node.color = historyItemData.win
                    ? cc.Color.YELLOW
                    : historyItem.winMoney.node.color.fromHEX("#E2E2E2");

                historyItem.time.node.color = historyItemData.win
                    ? cc.Color.YELLOW
                    : historyItem.time.node.color.fromHEX("#E2E2E2");
                historyItem.betChoice.node.color = historyItemData.win
                    ? cc.Color.YELLOW
                    : historyItem.betChoice.node.color.fromHEX("#E2E2E2");
            } else {
                historyItem.node.active = false;
            }

            this.content.addChild(historyItemPrefab);
        }
    }

    getHistoryData(page = 1) {
        this.root.sendData({ get_log: { page: page } });
    }

    buildBetChoce(select: boolean): string {
        return select ? "Chẵn" : "Lẻ";
    }
}
