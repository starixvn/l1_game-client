import GameBase from "../GameBase";
import DataHandler from "./DataHandler";

export default class GameBaseConfigsHandler implements DataHandler {
    constructor(protected readonly main: GameBase) {
    }

    handle(data: any): boolean {
        if (!data.gameConfigs) {
            return false;
        }

        this.main.gameConfigs = data.gameConfigs;
        data.gameConfigs.odds && this.setOdds(data.gameConfigs.odds);

        return true;
    }

    private setOdds(oddData: any) {
        this.main.betItems.forEach(item => item.setOdd(oddData[item.node.name]));
    }
}
