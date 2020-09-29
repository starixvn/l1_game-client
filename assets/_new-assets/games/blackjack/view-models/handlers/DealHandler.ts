import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";

export default class DealHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    handle(data: any): boolean {
        if (data.deal) {
            this.processData(data.deal);
        }
        return true;
    }

    processData(data: any) {

    }
}
