import RongHo from "../RongHo";
import DataHandler from "../../../../common/game/handlers/DataHandler";


export default class RHHistoryDataHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.viewlogs) {
            this.main.history && this.main.history.onData(data.viewlogs);
        }

        return true;
    }
}
