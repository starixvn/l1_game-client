import DataHandler from "./DataHandler";
import GameBase from "../GameBase";

export default class GameBaseOddsHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (!data.odds) {
            return false;
        }

        this.setOdds(data.odds);
        return true;
    }

    private setOdds(oddData: any) {
        console.log(oddData);
        this.main.betItems.forEach(item => item.setOdd(oddData[item.node.name]));
    }
}
