import GameUtils, { MINI_GAMES_SCALE_ON_DESKTOP } from "../../../common/GameUtils";
import MiniSedie from "./MiniSedie";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedieSubGame extends MiniSedie {
    openPlatePos = cc.v2(20, 40);

    setBlurDishAndHideDices() {
        this.animation.node.opacity = 0;
    }

    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.showWinChoiceAndUpdateHistory(settlement);

        const doLaterPayOut = () => {
            this.highlightAndPayout(settlement);
        };

        const doLaterBlurDish = () => {
            this.setBlurDishAndHideDices();
        };

        if (animated) {
            this.scheduleOnce(doLaterPayOut, 1.5);
            this.scheduleOnce(doLaterBlurDish, 2.5);
        } else {
            this.showDicesAndPlates();
            this.highlightAndPayout(settlement);
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

    hideDish() {
        this.animation.node.opacity = 0;
    }
}
