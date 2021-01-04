import DataHandler from "../../../_base/handlers/DataHandler";
import RongHo from "../RongHo";

export default class RHUMDataHandler implements DataHandler {
    constructor(private readonly main: RongHo) {}

    handle(data: any): boolean {
        if (!data.um) {
            return false;
        }

        if (this.main.currentTimeRemaining === this.main.config.betTime || data.time_remain === this.main.config.fullTime) {
            this.main.disabledGame = true;
            this.main.showUMWarning(data);
            return true;
        }

        return true;
    }
}
