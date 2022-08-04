import UnbalancedBigSmall from "./UnbalancedBigSmall";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmallSubGame extends UnbalancedBigSmall {
    scaleResultNode = 0.88;
    setOpacityThePlate() {
        this.shakeThePlateAnimation.node.opacity = 0;
    }

    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.showWinChoiceAndUpdateHistory(settlement);

        const doLater = () => {
            // this.setOpacityThePlate();
            this.highlightAndPayout(settlement);
        };
        if (animated) {
            this.scheduleOnce(doLater, 3);
        } else {
            doLater();
        }
    }
}
