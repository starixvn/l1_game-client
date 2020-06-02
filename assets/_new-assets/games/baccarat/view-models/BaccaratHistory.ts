const { ccclass, property } = cc._decorator;
import * as Pagination from "../../../common/helpers/Pagination/Pagination.js";
import { numberWithCommas, getStringDateByTime, nFormatter } from "../../../common/helpers/Helper";
import Baccarat from "./Baccarat.js";
import BaccaratHistoryItem from "./BaccaratHistoryItem";

@ccclass
export default class BaccaratHistory extends cc.Component {
    @property(Pagination)
    pages: Pagination = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property([cc.SpriteFrame])
    cardTypes: Array<cc.SpriteFrame> = [];

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    private root: Baccarat;
    private cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    init(root: Baccarat) {
        this.root = root;
    }

    private dataObserverKey = "BaccaratHistory";

    onLoad() {
        this.pages.init(this);
    }

    onEnable() {
        cc.RedT.addDataObserver(this.dataObserverKey, this.receivedData.bind(this));
        this.get_data();
    }

    onDisable() {
        cc.RedT.removeDataObserver(this.dataObserverKey);
        this.content.children.forEach(child => child.destroy());
        this.node.destroy();
    }

    receivedData(data) {
        if (data.baccarat && data.baccarat.history) {
            this.onData(data.baccarat.history);
        }
    }

    get_data(page = 1) {
        cc.RedT.send({ g: { baccarat: { log: { page: page } } } });
    }

    public onData(data: any) {
        this.pages.onSet(data.page, data.pageSize, data.total);
        this.content.children.forEach(child => child.destroy());

        for (let i = 0; i < data.betLogs.length; i++) {
            var dataT = data.betLogs[i];
            if (void 0 !== dataT) {
                let historyItemPrefab = cc.instantiate(this.prefabItem);
                let item = historyItemPrefab.getComponent("BaccaratHistoryItem") as BaccaratHistoryItem;
                item.node.active = true
                if (dataT.bet) {
                    item.time.string = getStringDateByTime(dataT.bet.time);
                    item.round.string = dataT.bet.phien;
                    item.win.string = numberWithCommas(dataT.bet.betwin);
                    item.win.node.color = dataT.bet.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
                }

                // item.result.forEach((kq, j) => {
                //     let cardType = kq.getComponent(cc.Sprite);
                //     cardType.spriteFrame = this.cardTypes[dataT.kq[j].type];

                //     let card = kq.children[0].getComponent(cc.Label);
                //     card.string = this.cards[dataT.kq[j].card];
                // });

                // item.betDragon.string = numberWithCommas(dataT.dragon);
                // item.betTiger.string = numberWithCommas(dataT.tiger);
                // item.betDraw.string = numberWithCommas(dataT.tie);

                // var card1 = dataT.kq[0];
                // var card2 = dataT.kq[1];
                // if (card1.card > card2.card) {
                //     item.betDragon.node.color = cc.Color.YELLOW;
                // } else if (card1.card < card2.card) {
                //     item.betTiger.node.color = cc.Color.YELLOW;
                // } else {
                //     item.betDraw.node.color = cc.Color.YELLOW;
                // }

                this.content.addChild(historyItemPrefab);
            }
        }
    }
}
