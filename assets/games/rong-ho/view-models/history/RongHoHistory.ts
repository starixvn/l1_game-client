import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";
import PaginationCommon from "../../../../common/helpers/Pagination/PaginationCommon";
import RongHo from "../RongHo";
import RongHoHistoryItem from "./RongHoHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoHistory extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property([cc.SpriteFrame])
    cardTypes: Array<cc.SpriteFrame> = [];

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    private root: RongHo;

    init(root: RongHo) {
        this.root = root;
    }

    onLoad() {
        this.pages.init(this);

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }

    onEnable() {
        this.get_data();
    }

    onData(data: any) {
        this.pages.onSet(data.page, data.kmess, data.total);
        this.content.children.forEach((child) => child.destroy());

        if (!data.data || !data.data.length) {
            return;
        }

        data.data.forEach((dataT) => {
            const historyItemPrefab = cc.instantiate(this.prefabItem);
            const item = historyItemPrefab.getComponent(RongHoHistoryItem);
            item.node.active = true;
            item.time.string = getStringDateByTime(dataT.time);
            item.round.string = dataT.phien;
            item.win.string = numberWithCommas(dataT.betwin);
            item.win.node.color = dataT.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
            item.cards.forEach((card, j) => {
                const cardData = {
                    rank: dataT.kq[j].card.toString(),
                    suit: dataT.kq[j].type
                };
                card.setCardOldStyle(cardData);
                card.faceUp();
            });

            item.betDragon.string = numberWithCommas(dataT.dragon);
            item.betTiger.string = numberWithCommas(dataT.tiger);
            item.betDraw.string = numberWithCommas(dataT.tie);

            const card1 = dataT.kq[0];
            const card2 = dataT.kq[1];
            if (card1.card > card2.card) {
                item.betDragon.node.color = cc.Color.YELLOW;
            } else if (card1.card < card2.card) {
                item.betTiger.node.color = cc.Color.YELLOW;
            } else {
                item.betDraw.node.color = cc.Color.YELLOW;
            }

            this.content.addChild(historyItemPrefab);
        });
    }

    get_data(page = 1) {
        this.root.sendData({ viewlogs: { page: page } });
    }
}
