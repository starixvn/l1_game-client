import * as Pagination from '../../../../common/helpers/Pagination/Pagination'
import RongHo from '../RongHo';
import RongHoHistoryItem from './RongHoHistoryItem';
import { numberWithCommas, getStringDateByTime, nFormatter } from '../../../../common/helpers/Helper';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoHistory extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(Pagination)
    pages: Pagination = null;

    @property([cc.SpriteFrame])
    cardTypes: Array<cc.SpriteFrame> = [];

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    private root: RongHo;
    private cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    init(root: RongHo) {
        this.root = root;
    }

    onLoad() {
        this.pages.init(this);
    }

    onEnable() {
        this.get_data();
    }

    onDisable() {
        this.root.hideHistory();
        this.content.children.forEach(child => child.destroy());
        this.node.destroy();
    }

    onData(data: any) {
        this.pages.onSet(data.page, data.kmess, data.total);
        this.content.children.forEach(child => child.destroy());

        for (let i = 0; i < data.data.length; i++) {
            var dataT = data.data[i];
            if (void 0 !== dataT) {
                let historyItemPrefab = cc.instantiate(this.prefabItem);
                let item = historyItemPrefab.getComponent("RongHoHistoryItem") as RongHoHistoryItem;
                item.node.active = true
                item.time.string = getStringDateByTime(dataT.time);
                item.round.string = dataT.phien;
                item.win.string = numberWithCommas(dataT.betwin);
                item.win.node.color = dataT.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
                item.result.forEach((kq, j) => {
                    let cardType = kq.getComponent(cc.Sprite);
                    cardType.spriteFrame = this.cardTypes[dataT.kq[j].type];

                    let card = kq.children[0].getComponent(cc.Label);
                    card.string = this.cards[dataT.kq[j].card];
                });

                item.betDragon.string = nFormatter(dataT.dragon, 1);
                item.betTiger.string = nFormatter(dataT.tiger, 1);
                item.betDraw.string = nFormatter(dataT.tie, 1);

                var card1 = dataT.kq[0];
                var card2 = dataT.kq[1];
                if (card1.card > card2.card) {
                    item.betDragon.node.color = cc.Color.YELLOW;
                } else if (card1.card < card2.card) {
                    item.betTiger.node.color = cc.Color.YELLOW;
                } else {
                    item.betDraw.node.color = cc.Color.YELLOW;
                }

                this.content.addChild(historyItemPrefab);
            }
        }
    }

    get_data(page = 1) {
        this.root.sendData({ viewlogs: { page: page } });
    }
}
