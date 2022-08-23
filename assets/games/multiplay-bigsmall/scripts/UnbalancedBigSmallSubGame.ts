import UnbalancedBigSmall from "./UnbalancedBigSmall";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmallSubGame extends UnbalancedBigSmall {
    scaleResultNode = 0.8;

    setBlurDish() {
        this.shakeThePlateAnimation.node.opacity = 0;
    }

    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.showWinChoiceAndUpdateHistory(settlement);

        const doLater = () => {
            this.highlightAndPayout(settlement);
            this.setBlurDish();
        };
        if (animated) {
            this.scheduleOnce(doLater, 3);
        } else {
            this.showDicesAndPlates();
            this.highlightAndPayout(settlement);
        }
    }

    initMiniRoundHistory(node: cc.Node) {
        super.initMiniRoundHistory(node);
        this.miniRoundHistory.tip.node.opacity = 0;
    }
}
