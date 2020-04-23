import RongHo from "../RongHo";
import DataHandler from "../../../../common/_base/view-models/DataHandler";


export default class BetDataHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.data) {
            console.log(`data rongho :  ${data.data}`);
        }

        if (data.me) {
            console.log(`data rongho own user:  ${data.me}`);
        }

        return true;
    }
}
