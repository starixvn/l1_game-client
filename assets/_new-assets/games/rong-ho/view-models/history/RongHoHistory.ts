import * as Pagination from '../../../../common/helpers/Pagination/Pagination'
import RongHo from '../RongHo';
import RongHoHistoryItem from './RongHoHistoryItem';
import { numberWithCommas, getStringDateByTime } from '../../../../common/helpers/Helper';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoHistory extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(Pagination)
    pages: Pagination = null;

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
        //this.root.hideHistory();
        this.node.destroy();
    }

    onData(data: any) {
        this.pages.onSet(data.page, data.kmess, data.total);
        this.content.removeAllChildren(true);

        this.items.forEach((obj, i) => {
            var dataT = data.data[i]
            if (void 0 !== dataT) {
                obj.node.active = true
                obj.time.string = getStringDateByTime(dataT.time);
                obj.round.string = dataT.phien;
                obj.win.string = numberWithCommas(dataT.betwin);
                obj.win.node.color = dataT.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
                obj.result.forEach(function (kq, j) {
                    //kq.spriteFrame = self.RedT.iconMini[dataT.kq[j]];
                });

                obj.bet.forEach(function (cuoc, k) {
                    // if (dataT[k] > 0) {
                    //     cuoc.node.parent.active = true;
                    //     cuoc.string = helper.nFormatter(dataT[k], 1);
                    // } else {
                    //     cuoc.node.parent.active = false;
                    // }
                })
            } else {
                obj.node.active = false
            }
        })
    }

    get_data(page = 1) {
        this.root.sendData({ viewlogs: { page: page } });
    }
}
