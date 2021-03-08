import PaginationCommon from "../../../../common/helpers/Pagination/PaginationCommon";
import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

export default class BauCuaHistoryNew extends cc.Component {
    @property(PaginationCommon)
    pages: PaginationCommon = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    cointRed: cc.Node = null;

    @property(cc.Node)
    cointXu: cc.Node = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    public red = true;
    protected contentList = [];

    // init(obj) {
    //     this.RedT = obj;
    // }

    onLoad() {
        this.pages.init(this);

        this.contentList = this.content.children.map(function (obj) {
            return obj.getComponent("BauCuaHistoryItem");
        });

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    }
    onEnable() {
        this.get_data();
    }
    get_data(page = 1) {
        cc.RedT.send({ g: { baucua: { viewlogs: { red: this.red, page: page } } } });
    }
    changerCoint() {
        this.red = !this.red;
        this.cointRed.active = !this.cointRed.active;
        this.cointXu.active = !this.cointXu.active;
        this.get_data();
    }
    onData(data) {
        // var self = this;
        this.pages.onSet(data.page, data.kmess, data.total);
        this.contentList.forEach(function (obj, i) {
            const dataT = data.data[i];
            if (void 0 !== dataT) {
                obj.node.active = true;
                obj.time.string = getStringDateByTime(dataT.time);
                obj.phien.string = dataT.phien;
                obj.thang.string = numberWithCommas(dataT.betwin);
                obj.thang.node.color = dataT.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
                // obj.kq.forEach(function (kq, j) {
                //     kq.spriteFrame = self.RedT.iconMini[dataT.kq[j]];
                // });

                obj.datLabel.forEach(function (cuoc, k) {
                    if (dataT[k] > 0) {
                        cuoc.node.parent.active = true;
                        cuoc.string = numberWithCommas(dataT[k]);
                    } else {
                        cuoc.node.parent.active = false;
                    }
                });
            } else {
                obj.node.active = false;
            }
        });
    }
}
