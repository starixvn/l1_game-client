import { getStringDateByTime, numberWithCommas } from '../../../../common/helpers/Helper';
import * as Pagination from '../../../../common/helpers/Pagination/Pagination';
import ChanLe from '../ChanLe';
import ChanLeHistoryItem from './ChanLeHistoryItem';

const { ccclass, property } = cc._decorator;
@ccclass
export default class ChanLeHistory extends cc.Component {
    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    private static readonly LICH_SU = "Lịch sử";
    private root: ChanLe;

    init(root: ChanLe) {
        this.root = root;
    }

    onLoad() {
        this.pages.init(this);
        this.title.string = `${ChanLeHistory.LICH_SU} ${this.root.gameTitle}`.toUpperCase();

        const commonDialog = this.mainFrame.getComponent('CommonDialog');
        commonDialog.onDidHide = () => { this.node.destroy(); };
    }

    onEnable() {
        this.get_data();
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
                const roundId = historyItemData.phien;
                historyItem.roundIdClick = () => {
                    this.root.showBetHistoryAtRound(roundId);
                };
                historyItem.betChoice.string = this.buildBetChoice(historyItemData.select);
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

    get_data(page = 1) {
        this.root.sendData({ get_log: { page: page } });
    }

    buildBetChoice(select: boolean): string {
        return select ? "Chẵn" : "Lẻ";
    }
}
