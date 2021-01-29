import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmDataHandler";
import SlotGameBase from "../SlotGameBase";

export default class SlotGameBaseUmHandler extends GameBaseUmDataHandler {
    constructor(protected readonly main: SlotGameBase) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data.um || this.main.isAnimatingResult) {
            return false;
        }

        this.main.isGoingToDisabled = true;
        this.main.showUmMessage(data);
        this.main.disableGame();

        return true;
    }
}
