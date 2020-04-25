import RongHo from "../RongHo";
import DataHandler from "../../../../common/_base/view-models/DataHandler";


export default class RHUMDataHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (!data.um) {
            return false;
        }

        if (this.main.currentTimeRemaining == this.main.config.betTime) {
            this.main.disabledGame = true;
            this.main.showUMWarning(data);
            return true;
        }
    }
}
