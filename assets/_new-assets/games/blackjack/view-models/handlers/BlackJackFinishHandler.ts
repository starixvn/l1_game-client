import { CardModel } from "../../../../common/new-card/view-models/NewCard";
import DataHandler from "../../../_base/handlers/DataHandler";
import BlackJack from "../BlackJack";


export default class BlackJackFinishHandler implements DataHandler {
    constructor(private readonly main: BlackJack) {
    }

    finishDataCache: any;

    handle(data: any): boolean {
        if (data.finish) {
            this.finishDataCache = data.finish;
        }
        return true;
    }

    processFinish() {
        const finish = this.finishDataCache;
        if (!finish) {
            console.error("BlackJack data finish did not receive");
            return;
        }
        const dealerCards: CardModel[] = finish.results;

    }


}
