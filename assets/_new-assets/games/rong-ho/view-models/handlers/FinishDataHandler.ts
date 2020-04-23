import RongHo from "../RongHo";
import DataHandler from "../../../../common/_base/view-models/DataHandler";


export default class FinishDataHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.finish) {
            console.log(`datafinish rongho :  ${data.finish}`);
        }
        return true;
    }
}
