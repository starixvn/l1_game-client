import GameUtils, { MINI_GAMES_SCALE_ON_DESKTOP } from "../../../common/GameUtils";
import UnbalancedBigSmall from "./UnbalancedBigSmall";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmallSubGame extends UnbalancedBigSmall {
    scaleResultNode = 0.8;

    setBlurDishAndHideDices() {
        this.shakeThePlateAnimation.node.opacity = 0;
    }

    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.showWinChoiceAndUpdateHistory(settlement);

        const doLater = () => {
            this.highlightAndPayout(settlement);
            this.setBlurDishAndHideDices();
            this.gameData.settlement.showStatus();
        };
        if (animated) {
            this.scheduleOnce(doLater, 3);
        } else {
            this.showDicesAndPlates();
            doLater();
        }
    }

    initMiniRoundHistory(node: cc.Node) {
        super.initMiniRoundHistory(node);
        this.miniRoundHistory.tip.node.opacity = 0;
    }

    customScaleNode(node: cc.Node) {
        node.scale = !cc.sys.isMobile ? MINI_GAMES_SCALE_ON_DESKTOP : 1;
    }

    showAcceptedBet(bet: number) {
        const node = GameUtils.addFlyingText(this.noticeNode, false, bet, 1);
        this.customScaleNode(node);
    }

    showWinningBet(bet: number) {
        const node = GameUtils.addFlyingText(this.noticeNode, true, bet, 4);
        node.name = "winningBet";
        this.customScaleNode(node);
    }
}
