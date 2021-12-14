import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmDataHandler";
import TexasHoldemPoker from "../view-models/texas-holdem-poker";

export default class TexasHoldemPokerUmHandler extends GameBaseUmDataHandler {
    constructor(protected readonly main: TexasHoldemPoker) {
        super(main);
    }

    handle(data: any): boolean {
        if (!data.um) {
            return false;
        }

        this.main.showUmMessage(data);

        return true;
    }
}
