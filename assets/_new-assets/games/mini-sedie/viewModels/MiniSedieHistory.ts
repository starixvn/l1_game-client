const { ccclass, property } = cc._decorator;
import * as Pagination from "../../../common/helpers/Pagination/Pagination.js";
import { numberWithCommas, getStringDateByTime, nFormatter } from "../../../common/helpers/Helper";

@ccclass
export default class MiniSedieHistory extends cc.Component {
    @property(cc.Prefab)
    page: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.SpriteFrame)
    iconRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    iconWhite: cc.SpriteFrame = null;

    private pagination: Pagination;
    private dataObserverKey = "MiniSedieHistory";

    onLoad() {
        let page = cc.instantiate(this.page);
        page.y = -295;
        this.node.addChild(page);
        this.pagination = page.getComponent("Pagination");
        this.pagination.init(this);
    }

    onEnable() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
        this.get_data();
    }

    receivedData(data) {
        if (data.miniSedie && data.miniSedie.history) {
            this.onData(data.miniSedie.history);
        }
    }

    get_data(page = 1) {
        cc.RedT.send({ g: { miniSedie: { getHistory: { page: page } } } });
    }

    public onData(data: any) {
        this.pagination.onSet(data.page, data.pageSize, data.total);
        this.content.children.map((item, index) => {
            let historyItem = item.getComponent("XocXoc_history_item");
            const dataT = data.betLogs[index];

            if (dataT) {
                historyItem.node.active = true;
                historyItem.bg.active = index % 2;

                historyItem.time.string = getStringDateByTime(dataT.time);
                historyItem.phien.string = dataT.phien;

                let numb = 0;
                const result = dataT.result;
                Object.keys(result).forEach(function (key) {
                    if (result[key]) {
                        numb++;
                    }
                });

                if (!(numb % 2)) {
                    historyItem.kqSprite.spriteFrame = this.iconWhite;
                    historyItem.kqLabel.node.color = cc.Color.BLACK;
                } else {
                    historyItem.kqSprite.spriteFrame = this.iconRed;
                    historyItem.kqLabel.node.color = cc.Color.WHITE;
                }
                historyItem.kqLabel.string = numb;

                historyItem.chan.string = numberWithCommas(dataT.even);
                historyItem.le.string = numberWithCommas(dataT.odd);
                historyItem.red3.string = numberWithCommas(dataT.red3);
                historyItem.red4.string = numberWithCommas(dataT.red4);
                historyItem.white3.string = numberWithCommas(dataT.white3);
                historyItem.white4.string = numberWithCommas(dataT.white4);
                historyItem.win.string = numberWithCommas(dataT.betwin);
                historyItem.win.node.color = dataT.betwin > 0
                    ? cc.Color.YELLOW
                    : historyItem.win.node.color.fromHEX("#E2E2E2");

                if (!(numb % 2)) {
                    historyItem.chan.node.color = cc.Color.YELLOW;
                    historyItem.le.node.color = cc.Color.WHITE;
                } else {
                    historyItem.le.node.color = cc.Color.YELLOW;
                    historyItem.chan.node.color = cc.Color.WHITE;
                }

                if (numb === 0) {
                    historyItem.white4.node.color = cc.Color.YELLOW;
                } else {
                    historyItem.white4.node.color = cc.Color.WHITE;
                }
                if (numb === 1) {
                    historyItem.white3.node.color = cc.Color.YELLOW;
                } else {
                    historyItem.white3.node.color = cc.Color.WHITE;
                }
                if (numb === 3) {
                    historyItem.red3.node.color = cc.Color.YELLOW;
                } else {
                    historyItem.red3.node.color = cc.Color.WHITE;
                }
                if (numb === 4) {
                    historyItem.red4.node.color = cc.Color.YELLOW;
                } else {
                    historyItem.red4.node.color = cc.Color.WHITE;
                }
            }
        });
    }
}
