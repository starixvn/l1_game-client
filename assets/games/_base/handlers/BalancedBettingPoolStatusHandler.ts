import GameBase from "../GameBase";
import { GameBaseStatusHandler } from "./GameBaseStatusHandler";

export default class BalancedBettingPoolStatusHandler extends GameBaseStatusHandler {
    constructor(protected readonly main: GameBase) {
        super(main);
    }

    handle(data: any): boolean {
        if (data.status) {
            this.currentStatusData = data.status;
        }

        return true;
    }
}
