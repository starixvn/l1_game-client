import GameBaseLogsHandler from "../../../_base/handlers/GameBaseLogsHandler";
import Roulette from "../Roulette";

export default class RouletteLogsHandler extends GameBaseLogsHandler {
    constructor(protected readonly main: Roulette) {
        super(main);
    }
}
