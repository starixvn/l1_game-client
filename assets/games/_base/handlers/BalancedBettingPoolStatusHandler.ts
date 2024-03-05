import GameBase from "../GameBase";
import { GameBaseStatusHandler } from "./GameBaseStatusHandler";

export default class BalancedBettingPoolStatusHandler extends GameBaseStatusHandler {
    constructor(protected readonly main: GameBase) {
        super(main);
    }
}
