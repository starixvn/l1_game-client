import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import BalancedBettingPoolBetItemBase from "../BalancedBettingPoolBetItemBase";
import BalancedBettingPoolGameBase from "../BalancedBettingPoolGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBalancedBettingHistoryBase extends cc.Component {
    @property(cc.Label)
    roundIdLabel: cc.Label = null;

    @property(cc.Label)
    leftBetAmount: cc.Label = null;

    @property(cc.Label)
    leftRefundAmount: cc.Label = null;

    @property(cc.Label)
    rightBetAmount: cc.Label = null;

    @property(cc.Label)
    rightRefundAmount: cc.Label = null;

    @property(cc.Node)
    leftContent: cc.Node = null;

    @property(cc.Node)
    rightContent: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    nextButton: cc.Node = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    protected main: BalancedBettingPoolGameBase;
    protected roundId = 0;
    protected data: any;

    init(main: BalancedBettingPoolGameBase, roundId: number) {
        this.main = main;
        this.roundId = roundId;

        this.getRound(this.roundId);
    }

    onDisable() {
        this.node.destroy();
    }

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }

        const commonDialog = this.mainFrame.getComponent(CommonDialog);
        commonDialog.addOnDidHide(() => {
            this.node.destroy();
        });
    }

    onNextClick() {
        this.getRound(this.roundId + 1);
    }

    onPreviousClick() {
        this.getRound(this.roundId - 1);
    }

    getRound(roundId: number) {
        this.main.socket.emit("getRound", { roundId });
    }

    addItem(data: any) {
        const item = cc.instantiate(this.itemPrefab);
        const itemComponent = item.getComponent(BalancedBettingPoolBetItemBase);
        itemComponent.setData(data);
        return item;
    }

    resetBettingUserList() {
        this.leftContent.destroyAllChildren();
        this.rightContent.destroyAllChildren();
    }

    onData(data: any) {
        this.resetBettingUserList();
        this.data = data;
        this.roundId = data.id;
        this.nextButton.active = this.main.currentDataLogs[0].roundId > data.id;
    }

    loadBettingUserList(leftBetType: string, rightBetType: string) {
        this.loadData(leftBetType, this.leftContent, this.leftBetAmount, this.leftRefundAmount);
        this.loadData(rightBetType, this.rightContent, this.rightBetAmount, this.rightRefundAmount);
    }

    loadData(choice: string, containerNode: cc.Node, betAmountLabel: cc.Label, refundLabel: cc.Label) {
        if (this.data[choice] && this.itemPrefab) {
            this.data[choice].forEach((user) => {
                const item = this.addItem(user);
                containerNode.addChild(item);
            });
        }

        this.setAmount(this.data.total[choice], betAmountLabel, refundLabel);
    }

    setAmount(total: any, betAmountLabel: cc.Label, refundLabel: cc.Label) {
        let betAmount = 0;
        let refund = 0;

        if (total) {
            betAmount = total.betAmount;
            refund = total.refund;
        }

        betAmountLabel.string = numberWithCommas(betAmount);
        refundLabel.string = numberWithCommas(refund);
    }
}
