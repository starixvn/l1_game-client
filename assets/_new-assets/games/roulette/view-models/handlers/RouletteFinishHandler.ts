import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import Roulette from "../Roulette";

export default class RouletteFinishHandler extends GameBaseFinishHandler {

    constructor(protected readonly main: Roulette) {
        super(main, 2);
    }
}
