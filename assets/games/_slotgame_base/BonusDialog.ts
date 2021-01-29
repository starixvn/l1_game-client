import AnimatedTime from "../../common/animated-time/view-models/AnimatedTime";
import { numberWithCommas } from "../../common/helpers/NumberHelper";
import BonusItem from "./BonusItem";
import { SlotGameBaseConfigs } from "./SlotGameBaseConfigs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BonusDialog extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    bonusCount: cc.Label = null;

    @property(AnimatedTime)
    timer: AnimatedTime = null;

    @property(cc.Node)
    totalBonusNode: cc.Node = null;

    @property(cc.Label)
    totalBonusLabel: cc.Label = null;

    items: BonusItem[] = [];

    public onBonusFinished = () => {};
    public onItemClicked = (index: number) => {};
    public slotGameConfigs: SlotGameBaseConfigs;

    private totalBonus = 0;
    private openedBonus = 0;
    private totalValue = 0;
    private timerTween: cc.Tween;

    onLoad() {
        this.content.children.forEach((child, index) => {
            const item = child.getComponent(BonusItem);
            item && this.items.push(item);
            child.on("click", () => {
                if (this.openedBonus < this.totalBonus) {
                    this.onItemClicked(index);
                    const button = child.getComponent(cc.Button);
                    button.interactable = false;
                }
            });
        });
    }

    openBonus(index: number, value: number) {
        const item = this.items[index];
        item && item.open(value);
        this.openedBonus++;
        this.totalValue += value;
        this.updateBonusCount();
        this.checkFinishBonus();
    }

    hideTimer() {
        this.timer.node.active = false;
        this.timerTween.stop();
    }

    showTotalAmount() {
        this.hideTimer();
        this.totalBonusNode.active = true;
        this.totalBonusLabel.string = `+${numberWithCommas(this.totalValue)}`;
    }

    checkFinishBonus() {
        if (this.openedBonus === this.totalBonus) {
            const delayTime = 1;
            cc.tween(this)
                .delay(delayTime)
                .call(() => this.showTotalAmount())
                .delay(this.slotGameConfigs.showTotalBonusAmountDuration - delayTime)
                .call(() => this.node.destroy())
                .start();
        }
    }

    setBonusCount(count: number) {
        this.totalBonus = count;
        this.updateBonusCount();
    }

    updateBonusCount() {
        this.bonusCount.string = `${this.totalBonus - this.openedBonus}`;
    }

    start() {
        const duration = this.slotGameConfigs.bonusTimeOut;
        let count = 0;
        this.timer.setAnimatedY(5, 0);
        this.timerTween = cc
            .tween(this)
            .repeat(
                duration,
                cc
                    .tween()
                    .call(() => {
                        this.timer.setTime(`${duration - count}`);
                        count++;
                    })
                    .delay(1)
            )
            .call(() => {
                this.hideTimer();
            })
            .start();
    }

    onDestroy() {
        this.onBonusFinished();
    }
}
