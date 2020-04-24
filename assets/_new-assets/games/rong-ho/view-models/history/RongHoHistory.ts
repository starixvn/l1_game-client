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

    private root: RongHo;
    private items: RongHoHistoryItem[];

    init(root: RongHo) {
        this.root = root;
    }

    onLoad() {
        this.pages.init(this);

        this.items = this.content.children.map(function (obj) {
            return obj.getComponent('RongHoHistoryItem');
        })
    }

    onEnable() {
        this.get_data();
    }

    onDisable() {
        this.root.hideHistory();
        this.node.destroy();
    }

    onData(data: any) {
        this.pages.onSet(data.page, data.kmess, data.total);

        this.items.forEach((obj, i) => {
            var dataT = data.data[i];
            if (void 0 !== dataT) {
                obj.node.active = true
                obj.time.string = getStringDateByTime(dataT.time);
                obj.round.string = dataT.phien;
                obj.win.string = numberWithCommas(dataT.betwin);
                obj.win.node.color = dataT.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
                obj.result.forEach((kq, j) => {
                    let cardType = kq.getComponent(cc.Sprite);
                    cardType.spriteFrame = this.cardTypes[dataT.kq[j].type];

                    let card = kq.children[0].getComponent(cc.Label);
                    card.string = dataT.kq[j].card;
                });

                obj.betDragon.string = nFormatter(dataT.dragon, 1);
                obj.betTiger.string = nFormatter(dataT.tiger, 1);
                obj.betDraw.string = nFormatter(dataT.draw, 1);
            } else {
                obj.node.active = false
            }
        })
    }

    get_data(page = 1) {
        this.root.sendData({ viewlogs: { page: page } });
    }
}
