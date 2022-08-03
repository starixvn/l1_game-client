import UnbalancedBigSmall from "./UnbalancedBigSmall";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmallSubGame extends UnbalancedBigSmall {
    setOpacityThePlate() {
        this.shakeThePlateAnimation.node.opacity = 0;
    }

    handleAfterSettlementResult(settlement: any) {
        this.gameData.roundHistory.add(settlement);
        this.showWaittingTime(true);
        this.updateRoundHistory();
        this.showWinningAnimation(this.currentDataLogs[0]);
        this.gameData.resultHash.updateUI();
        this.scheduleOnce(() => {
            this.shakeThePlateAnimation.node.opacity = 0;
            this.gameData.settlement.showStatus();
            this.betItems.forEach((betItem) => betItem.setHighlight(settlement.settlementResult[betItem.node.name.toLowerCase()], true));
        }, 3);
    }
}
