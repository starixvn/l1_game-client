
import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";

export default class IngameActionHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    handle(data: any): boolean {
        return true;
    }
}
