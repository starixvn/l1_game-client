import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmDataHandler";
import Texas from "../view-models/texas";

export default class TexasUmHandler extends GameBaseUmDataHandler {
    constructor(protected readonly main: Texas) {
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
