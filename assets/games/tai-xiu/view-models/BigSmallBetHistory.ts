import { shortenName } from '../../../common/helpers/NicknameHelper';
import { numberWithCommas } from '../../../common/helpers/NumberHelper';
import { getStringDateByTime, getStringHourByTime } from './../../../common/helpers/DateTimeHelper';
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
    bigBetAmount: cc.Label = null;

    @property(cc.Label)
    bigRefundAmount: cc.Label = null;

    @property(cc.Label)
    smallBetAmount: cc.Label = null;

    @property(cc.Label)
    smallRefundAmount: cc.Label = null;

    @property(cc.Node)
    bigContent: cc.Node = null;

    @property(cc.Node)
    smallContent: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    nextButton: cc.Node = null;

    @property(cc.Node)
    bigNode: cc.Node = null;

    @property(cc.Node)
    smallNode: cc.Node = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    private main: BigSmall;
    private roundId = 0;

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

        const { id, time, total, result, big, small, settlementResult } = data;
        this.roundId = id;
        this.roundIdLabel.string = `${id} - ${getStringDateByTime(time)}`;

        this.bigBetAmount.string = numberWithCommas(total?.big?.betAmount ?? 0);
        this.bigRefundAmount.string = numberWithCommas(total?.big?.refund ?? 0);
        this.smallBetAmount.string = numberWithCommas(total?.small?.betAmount ?? 0);
        this.smallRefundAmount.string = numberWithCommas(total?.small?.refund ?? 0);

        this.bigNode.opacity = settlementResult?.big ? 255 : 100;
        this.smallNode.opacity = settlementResult?.small ? 255 : 100;

        this.updateDotsResult(result);

        big &&
            big.forEach((user) => {
                const item = this.addItem(user);
                this.bigContent.addChild(item);
            });

        small &&
            small.forEach((user) => {
                const item = this.addItem(user);
                this.smallContent.addChild(item);
            });

        this.nextButton.active = this.main.currentDataLogs[0].roundId > id;
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

        const isLoginUser = data.name === cc.RedT.user.name;
        itemComponent.highlight.active = isLoginUser;
        itemComponent.time.string = getStringHourByTime(data.time);
        itemComponent.username.string = isLoginUser ? data.name : shortenName(data.name);
        itemComponent.betAmount.string = numberWithCommas(data.amount);
        itemComponent.refund.string = numberWithCommas(data.refund);

        return item;
    }

    resetData() {
        this.bigContent.destroyAllChildren();
        this.smallContent.destroyAllChildren();
    }
}
