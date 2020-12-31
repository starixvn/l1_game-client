import { getStringDateByTime, getStringHourByTime, numberWithCommas, shortenName } from "./../../../common/helpers/Helper";
import SpecialSeDie from "./SpecialSeDie";
import SpecialSedieBetHistoryItem from "./SpecialSedieBetHistoryItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SpecialSedieBetHistory extends cc.Component {
    @property(cc.Label)
    roundIdLabel: cc.Label = null;

    @property(cc.Node)
    dots: cc.Node = null;

    @property(cc.SpriteFrame)
    redDot: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    whiteDot: cc.SpriteFrame = null;

    @property(cc.Label)
    evenBetAmount: cc.Label = null;

    @property(cc.Label)
    evenRefundAmount: cc.Label = null;

    @property(cc.Label)
    oddBetAmount: cc.Label = null;

    @property(cc.Label)
    oddRefundAmount: cc.Label = null;

    @property(cc.Node)
    evenContent: cc.Node = null;

    @property(cc.Node)
    oddContent: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    nextButton: cc.Node = null;

    @property(cc.Node)
    evenNode: cc.Node = null;

    @property(cc.Node)
    oddNode: cc.Node = null;

    private main: SpecialSeDie;
    private roundId = 0;

    init(main: SpecialSeDie, roundId: number) {
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

        const { id, time, total, result, even, odd, settlementResult } = data;
        this.roundId = id;
        this.roundIdLabel.string = `${id} - ${getStringDateByTime(time)}`;

        this.evenBetAmount.string = numberWithCommas(total?.even?.betAmount ?? 0);
        this.evenRefundAmount.string = numberWithCommas(total?.even?.refund ?? 0);
        this.oddBetAmount.string = numberWithCommas(total?.odd?.betAmount ?? 0);
        this.oddRefundAmount.string = numberWithCommas(total?.odd?.refund ?? 0);

        this.evenNode.opacity = settlementResult?.even ? 255 : 100;
        this.oddNode.opacity = settlementResult?.odd ? 255 : 100;

        this.updateDotsResult(result);

        even &&
            even.forEach((user) => {
                const item = this.addItem(user);
                this.evenContent.addChild(item);
            });

        odd &&
            odd.forEach((user) => {
                const item = this.addItem(user);
                this.oddContent.addChild(item);
            });

        this.nextButton.active = this.main.currentDataLogs[0].roundId > id;
    }

    updateDotsResult(result: any) {
        Object.keys(result).forEach((key, index) => {
            const dot = this.dots.children[index]?.getComponent(cc.Sprite);
            dot.spriteFrame = result[key] ? this.redDot : this.whiteDot;
        });
    }

    addItem(data: any) {
        const item = cc.instantiate(this.itemPrefab);
        const itemComponent = item.getComponent(SpecialSedieBetHistoryItem);

        const isLoginUser = data.name === cc.RedT.user.name;
        itemComponent.highlight.active = isLoginUser;
        itemComponent.time.string = getStringHourByTime(data.time);
        itemComponent.username.string = isLoginUser ? data.name : shortenName(data.name);
        itemComponent.betAmount.string = numberWithCommas(data.amount);
        itemComponent.refund.string = numberWithCommas(data.refund);

        return item;
    }

    resetData() {
        this.evenContent.destroyAllChildren();
        this.oddContent.destroyAllChildren();
    }
}
