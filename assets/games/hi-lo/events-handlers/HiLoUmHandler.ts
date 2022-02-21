import GameBaseUmDataHandler from "../../_base/handlers/GameBaseUmDataHandler";
import HiLo from "../view-models/HiLo";

export default class HiLoUmHandler extends GameBaseUmDataHandler {
    constructor(protected readonly main: HiLo) {
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
