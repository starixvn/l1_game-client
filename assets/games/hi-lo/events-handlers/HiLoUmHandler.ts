import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmDataHandler";
import HiLo from "../view-models/HiLo";
import { GameState } from "../../_base/GameBase";

export default class HiLoUmHandler extends GameBaseUmDataHandler {
    constructor(protected readonly main: HiLo) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data.um) {
            this.main.hideUmMessage();
            this.main.gameState = GameState.Started;
            this.main.resetUIBlankNewState();
            return false;
        }
        this.main.isGoingToDisabled = true;
        this.main.showUmMessage(data);
        this.main.disableGame();

        return true;
    }
}
