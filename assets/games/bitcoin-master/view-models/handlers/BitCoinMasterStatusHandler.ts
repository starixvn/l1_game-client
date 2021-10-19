import { GameBaseStatusHandler } from "../../../_base/handlers/GameBaseStatusHandler";
import BitcoinMaster from "../BitcoinMaster";

export default class BitcoinMasterStatusHandler extends GameBaseStatusHandler {
    constructor(protected readonly main: BitcoinMaster) {
        super(main);
    }

    handle(data: any): boolean {
        if (data.status) {
            this.currentStatusData = data.status;
        }

        return true;
    }
}
