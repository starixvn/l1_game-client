import GameBaseTimeHandler from "../../../_base/handlers/GameBaseTimeHandler";
import Roulette from "../Roulette";

export default class RouletteTimeHandler extends GameBaseTimeHandler {

    constructor(protected readonly main: Roulette) {
        super(main);
    }

    handleInLockBetTime() {
        super.handleInLockBetTime();
        this.main.clearTempBetChoices();
        this.main.rouletteMain.board.rouletteNumbers.forEach(n => n.hideWinning());
        this.main.rouletteMain.board.groupItems.forEach(n => n.hideWinning());
    }

    handleStartingNewGameRound() {
        super.handleStartingNewGameRound();
        this.main.clearCurrentBetChoices();
        this.main.rouletteMain.board.rouletteNumbers.forEach(n => n.hideWinning());
        this.main.rouletteMain.board.groupItems.forEach(n => n.hideWinning());
    }
}
