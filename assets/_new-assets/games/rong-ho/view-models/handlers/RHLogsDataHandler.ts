import RongHo from "../RongHo";
import DataHandler from "../../../../common/_base/view-models/DataHandler";

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
