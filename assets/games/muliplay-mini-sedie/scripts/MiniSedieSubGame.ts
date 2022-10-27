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
            this.gameData.settlement.showStatus();
        };

        if (animated) {
            this.scheduleOnce(doLaterPayOut, 1.5);
        } else {
            this.showDicesAndPlates();
            this.dishNode.opacity = 0;
            doLaterPayOut();
        }
    }

    showOriginalDish() {
        this.animation.node.opacity = 255;
        this.animation.node.position = cc.v3(0, 18, 0);
        this.animation.node.scale = 0.9;
    }
}
