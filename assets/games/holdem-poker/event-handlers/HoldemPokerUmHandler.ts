import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmDataHandler";
import HoldemPoker from "../view-models/HoldemPoker";

export default class HoldemPokerUmHandler extends GameBaseUmDataHandler {
    constructor(protected readonly main: HoldemPoker) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data.um) {
            return false;
        }
        this.main.showUmMessage(data);
        this.main.disableGame();

        return true;
    }
}
