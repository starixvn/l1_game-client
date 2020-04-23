import RongHo from "../RongHo";
import DataHandler from "../../../../common/_base/view-models/DataHandler";


export default class BetStatusDataHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        return true;
    }
}
