import RongHo from "../RongHo";
import DataHandler from "../../../_base/handlers/DataHandler";


export default class RHBetDataHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.data || data.me) {
            this.main.betItems.forEach(item => item.setData(data));
        }

        if (data.endCuoc) {
            this.main.waitingCuoc = false;
            data.endCuoc != -1 && this.main.showAcceptedBet(data.endCuoc); //endCuoc -1 is error
            this.main.showWarningSlowBet(false);
        }
        return true;
    }
}
