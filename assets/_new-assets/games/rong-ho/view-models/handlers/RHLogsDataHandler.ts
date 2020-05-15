import RongHo from "../RongHo";
import DataHandler from "../../../_base/handlers/DataHandler";

export default class RHLogsDataHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.logs) {
            this.main.logs = data.logs;
            this.main.updateLogs();
        }
        return true;
    }
}
