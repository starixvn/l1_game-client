import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import VipFishPrawnCrab from "../VipFishPrawnCrab";

export default class VipFishPrawnCrabTimeHandler extends GameBaseTimeHandler {
    constructor(protected readonly main: VipFishPrawnCrab) {
        super(main);
    }
    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.shakeAnimation.node.active = true;
        this.main.shakeAnimation.play();
    }
}
