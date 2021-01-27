import { getStringDateByTime } from "../../../../../_new-assets/common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../../_new-assets/common/helpers/NumberHelper";
import PaginationCommon from "../../../../../_new-assets/common/helpers/Pagination/PaginationCommon";

cc.Class({
    extends: cc.Component,
    properties: {
        content: cc.Node,
        page: PaginationCommon,
        ItemPrefab: cc.Prefab,
        mainFrame: {
            default: null,
            type: cc.Node
        }
    },
    init(obj) {
        this.RedT = obj;
    },
    onLoad() {
        this.page.init(this);

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    },
    onEnable: function () {
        this.get_data();
    },
    onDisable: function () {},
    get_data: function (page = 1) {
        cc.RedT.send({ taixiu: { get_log: { page: page } } });
    },
    hide: function () {
        this.node.active = false;
    },
    onData: function (data) {
        this.page.onSet(data.page, data.kmess, data.total);
        this.content.removeAllChildren(true);

        for (var i = 0; i < 9; i++) {
            var dataT = data.data[i];
            var itemPrefab = cc.instantiate(this.ItemPrefab);
            var item = itemPrefab.getComponent("TXHistoryItem");
            if (void 0 !== dataT) {
                item.node.active = true;
                var tong = dataT.dice1 + dataT.dice2 + dataT.dice3;
                item.time.string = getStringDateByTime(dataT.time);
                item.phien.string = dataT.phien;
                const roundId = dataT.phien;
                item.roundIdClick = () => {
                    this.RedT.showBetHistoryAtRound(roundId);
                };
                item.dat.string = dataT.select ? "Tài" : "Xỉu";
                item.ketqua.string = `${dataT.dice1}-${dataT.dice2}-${dataT.dice3}  ${tong}`;
                item.cuoc.string = numberWithCommas(dataT.bet);
                item.tralai.string = numberWithCommas(dataT.tralai);
                item.win.string = numberWithCommas(dataT.betwin);

                if (dataT.win) {
                    item.win.node.color = cc.Color.YELLOW;
                    item.time.node.color = cc.Color.YELLOW;
                    item.dat.node.color = cc.Color.YELLOW;
                } else {
                    item.win.node.color = item.win.node.color.fromHEX("#E2E2E2");
                    item.time.node.color = item.time.node.color.fromHEX("#E2E2E2");
                    item.dat.node.color = item.dat.node.color.fromHEX("#E2E2E2");
                }
            } else {
                item.node.active = false;
            }
            this.content.addChild(itemPrefab);
        }
    }
});
