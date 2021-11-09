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
    }

    loadBettingUserList(leftBetType: string, rightBetType: string) {
        if (this.data[leftBetType]) {
            this.data[leftBetType].forEach((user) => {
                const item = this.addItem(user);
                this.leftContent.addChild(item);
            });
        }

        if (this.data[rightBetType]) {
            this.data[rightBetType].forEach((user) => {
                const item = this.addItem(user);
                this.rightContent.addChild(item);
            });
        }

        const leftChoice = this.data.total[leftBetType];
        const rightChoice = this.data.total[rightBetType];

        let leftBetAmount = 0;
        let rightBetAmount = 0;
        let leftRefund = 0;
        let rightRefund = 0;

        if (leftChoice) {
            leftBetAmount = leftChoice.betAmount;
            leftRefund = leftChoice.refund;
        }

        if (rightChoice) {
            rightBetAmount = rightChoice.betAmount;
            rightRefund = rightChoice.refund;
        }

        this.leftBetAmount.string = numberWithCommas(leftBetAmount);
        this.rightBetAmount.string = numberWithCommas(rightBetAmount);

        this.leftRefundAmount.string = numberWithCommas(leftRefund);
        this.rightRefundAmount.string = numberWithCommas(rightRefund);
    }
}
