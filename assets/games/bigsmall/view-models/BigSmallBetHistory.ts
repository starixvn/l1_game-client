import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import { getStringDateByTime } from './../../../common/helpers/DateTimeHelper';
import BigSmall from './BigSmall';
import BigSmallBetHistoryItem from './BigSmallBetHistoryItem';

const { ccclass, property } = cc._decorator;
@ccclass
export default class BigSmallBetHistory extends cc.Component {
    @property(cc.Label)
    roundIdLabel: cc.Label = null;

    @property(cc.Sprite)
    dices: cc.Sprite[] = [];

    @property(cc.SpriteFrame)
    diceFrames: cc.SpriteFrame[] = [];

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
    leftResultNode: cc.Node = null;

    @property(cc.Node)
    rightResultNode: cc.Node = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    protected main: BigSmall;
    protected roundId = 0;
    @property(cc.Label)
    titleLabel: cc.Label = null;

    public gameTitle = "";
    private readonly betHistoryTitle = "LỊCH SỬ PHIÊN";

    init(main: BigSmall, roundId: number) {
        this.main = main;
        this.roundId = roundId;
    }

    onDisable() {
        this.node.destroy();
    }

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }

        this.getRound(this.roundId);

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };

        this.titleLabel.string = `${this.betHistoryTitle} ${this.gameTitle.toUpperCase()}`;
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

    onData(data: any) {
        this.resetData();

        const { id, time, result } = data;
        this.roundIdLabel.string = `${id} - ${getStringDateByTime(time)}`;
        this.nextButton.active = this.main.currentDataLogs[0].roundId > id;

        this.updateChoicesData(data);
        this.updateDotsResult(result);
    }

    updateChoicesData(data) {
        const { total, big, small, settlementResult } = data;

        this.leftBetAmount.string = numberWithCommas(total?.big?.betAmount ?? 0);
        this.leftRefundAmount.string = numberWithCommas(total?.big?.refund ?? 0);
        this.rightBetAmount.string = numberWithCommas(total?.small?.betAmount ?? 0);
        this.rightRefundAmount.string = numberWithCommas(total?.small?.refund ?? 0);

        this.leftResultNode.opacity = settlementResult?.big ? 255 : 100;
        this.rightResultNode.opacity = settlementResult?.small ? 255 : 100;

        if (big.length) {
            big.forEach((user) => {
                const item = this.addItem(user);
                this.leftContent.addChild(item);
            });
        }

        if (small.length) {
            small.forEach((user) => {
                const item = this.addItem(user);
                this.rightContent.addChild(item);
            });
        }
    }

    updateDotsResult(result: any) {
        Object.keys(result).forEach((key, index) => {
            const dot = this.dices[index].getComponent(cc.Sprite);
            dot.spriteFrame = this.diceFrames[result[key] - 1];
        });
    }

    addItem(data: any) {
        const item = cc.instantiate(this.itemPrefab);
        const itemComponent = item.getComponent(BigSmallBetHistoryItem);
        itemComponent.setData(data);
        return item;
    }

    resetData() {
        this.leftContent.destroyAllChildren();
        this.rightContent.destroyAllChildren();
    }
}
