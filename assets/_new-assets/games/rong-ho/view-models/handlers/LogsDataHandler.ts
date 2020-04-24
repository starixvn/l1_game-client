import RongHo from "../RongHo";
import DataHandler from "../../../../common/_base/view-models/DataHandler";

export default class LogsDataHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.logs) {
            console.log("rong ho handle logs here");
        }
        return true;
    }
}
