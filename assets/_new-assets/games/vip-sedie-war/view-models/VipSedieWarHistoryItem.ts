import { getStringDateByTime, numberWithCommas } from "./../../../common/helpers/Helper";
import VipSedieWarTicketDetail from "./VipSedieWarTicketDetail";
import VipSedieWarUtils from "./VipSedieWarUtils";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VipSedieWarHistoryItem extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    @property(cc.Node)
    playerResultNode: cc.Node = null;

    @property(cc.Node)
    bankerResultNode: cc.Node = null;

    @property({ type: cc.SpriteFrame })
    dotsFrame: cc.SpriteFrame[] = [];

    getMiniPanel: () => cc.Node;

    detailtData: any;

    setData(data: any) {
        const { time, phien, result, settlementResult, betwin, totalAmount, betLogDetails } = data;

        this.time.string = getStringDateByTime(time);
        this.roundId.string = phien;
        this.win.string = numberWithCommas(betwin);
        this.bet.string = numberWithCommas(totalAmount);

        VipSedieWarUtils.setDotsImage(result, this.playerResultNode, this.bankerResultNode, this.dotsFrame);

        this.detailtData = {
            phien,
            betLogDetails,
            settlementResult,
            result
        }
    }

    onLoad() {
        this.bet.node.on('click', () => {
            this.openTicketDetail();
        }, false);
    }

    openTicketDetail() {
        const miniPanel = this.getMiniPanel();
        const node = cc.instantiate(this.ticketDetailPrefab);
        node.getComponent(VipSedieWarTicketDetail).setData(this.detailtData);
        miniPanel.addChild(node);
    }
}
