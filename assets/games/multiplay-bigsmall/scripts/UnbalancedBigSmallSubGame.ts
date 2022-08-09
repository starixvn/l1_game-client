import UnbalancedBigSmall from "./UnbalancedBigSmall";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmallSubGame extends UnbalancedBigSmall {
    scaleResultNode = 0.8;

    hideDicesAndPlates() {
        this.shakeThePlateAnimation.node.opacity = 0;
    }

    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.showWinChoiceAndUpdateHistory(settlement);

        const doLater = () => {
            this.highlightAndPayout(settlement);
            this.hideDicesAndPlates();
        };
        if (animated) {
            this.scheduleOnce(doLater, 3);
        } else {
            this.showDicesAndPlates();
            this.highlightAndPayout(settlement);
        }
    }
}
