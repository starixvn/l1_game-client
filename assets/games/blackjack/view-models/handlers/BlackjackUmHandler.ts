import GameBaseUmDataHandler from "../../../_base/handlers/GameBaseUmDataHandler";
import BlackJack from "../BlackJack";

export default class BlackjackUmHandler extends GameBaseUmDataHandler {
    constructor(protected readonly main: BlackJack) {
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
