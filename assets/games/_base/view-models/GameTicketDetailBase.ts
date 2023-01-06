import { i18n } from "../../../ClientModules";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import BetDetailFrame from "../../../common/new-history/BetDetailFrame";
import BetDetailTable from "../../../common/new-history/BetDetailTable";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameTicketDetailBase extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    @property(cc.Node)
    backWrapper: cc.Node = null;

    @property(cc.Label)
    gameName: cc.Label = null;

    betLogDetails = null;
    settlementResult = null;
    betDetailFrame: BetDetailFrame;
    betDetailTable: BetDetailTable;

    WIDTH_SIGN = 120;
    public gameId = 0;

    public HEIGHT_BET_DETAIL_TABLE = 452;
    public WIDTH_BET_DETAIL_TABLE = 1000;

    onLoad() {
        this.content.children.forEach((child) => child.destroy());
    }

    setGameName() {
        const dataId = `gameNames.${this.gameId}`;
        const gameName = ` - ${i18n.t(dataId)}`;
        this.gameName.string = gameName.toUpperCase();
        this.gameName.node.active = true;
    }

    start() {
        if (this.gameId != 0) {
            this.setGameName();
            const node = this.gameName.node.parent;
            node.getComponent(cc.Layout).updateLayout();
            this.betDetailFrame.updateTitleSize(node.width + this.WIDTH_SIGN);
        }
    }

    public setData(betLogDetails: any, settlementResult: any) {
        this.betLogDetails = betLogDetails;
        this.settlementResult = settlementResult;
    }

    initBetDetailFrame(node: cc.Node) {
        this.betDetailFrame = node.getComponent(BetDetailFrame);
        this.backWrapper = this.betDetailFrame.backWrapper;
        this.gameName = this.betDetailFrame.gameName;
        const commonDialog = this.backWrapper.getComponent(CommonDialog);
        commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
        this.betDetailFrame.updateSizeFrame(this.mainFrame.width, this.mainFrame.height);
        this.mainFrame.parent = this.backWrapper;
    }

    initBetDetailTable(node: cc.Node) {
        this.betDetailTable = node.getComponent(BetDetailTable);
        this.betDetailTable.updateSize(this.WIDTH_BET_DETAIL_TABLE, this.HEIGHT_BET_DETAIL_TABLE);
    }
}
