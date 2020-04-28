import RongHo from "../RongHo";
import DataHandler from "../../../../common/_base/view-models/DataHandler";


export default class RHBetStatusDataHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.status && data.bet) {
            this.main.status(data.status, data.bet);
        }
        return true;
    }
}
