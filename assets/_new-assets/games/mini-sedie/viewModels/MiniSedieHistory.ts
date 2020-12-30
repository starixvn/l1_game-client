import { getStringDateByTime, numberWithCommas } from '../../../common/helpers/Helper';
import * as Pagination from '../../../common/helpers/Pagination/Pagination.js';
import SedieHistoryItem from '../../xoc-xoc/view-models/SedieHistoryItem';

const { ccclass, property } = cc._decorator;
@ccclass
export default class MiniSedieHistory extends cc.Component {
    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    iconRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    iconWhite: cc.SpriteFrame = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;


    private pagination: Pagination;
    private dataObserverKey = "MiniSedieHistory";

    onLoad() {
        this.pages.init(this);

        const commonDialog = this.mainFrame.getComponent('CommonDialog');
        commonDialog.onDidHide = () => { this.node.destroy(); };
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

    onData(data) {
        const { page, pageSize, total, betLogs } = data;
        this.pages.onSet(page, pageSize, total);
        this.content.destroyAllChildren();

        if (betLogs && betLogs.length) {
            betLogs.map((betLog, index) => {
                const itemNode = cc.instantiate(this.itemPrefab);
                const item = itemNode.getComponent(SedieHistoryItem);
                item.node.active = true;
                item.bg.active = (index % 2) > 0;

                const { time, phien, result, settlementResult, betwin } = betLog;

                item.time.string = getStringDateByTime(time);
                item.phien.string = phien;

                let number = 0;
                Object.keys(result).forEach(key => {
                    if (result[key]) {
                        number++;
                    }
                });

                item.kqLabel.string = number.toString();
                if (number % 2) {
                    item.kqSprite.spriteFrame = this.iconRed;
                    item.kqLabel.node.color = cc.Color.WHITE;
                } else {
                    item.kqSprite.spriteFrame = this.iconWhite;
                    item.kqLabel.node.color = cc.Color.BLACK;
                }

                Object.keys(settlementResult).forEach(choice => {
                    item[choice].string = numberWithCommas(betLog[choice]);
                    if (settlementResult[choice]) {
                        item[choice].node.color = cc.Color.YELLOW;
                    } else {
                        item[choice].node.color = cc.Color.WHITE;
                    }
                });

                item.win.string = numberWithCommas(betwin);

                this.content.addChild(itemNode);
            });
        }
    }
}
