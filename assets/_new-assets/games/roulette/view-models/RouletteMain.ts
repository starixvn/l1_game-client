import RouletteBoard from "./RouletteBoard";
import Roulette from "./Roulette";
import RouletteQuickBet from "./RouletteQuickBet";
import RouletteWheel from "./RouletteWheel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteMain extends cc.Component {
    @property(RouletteBoard)
    board: RouletteBoard = null;

    @property(RouletteQuickBet)
    quickBet: RouletteQuickBet = null;

    @property(RouletteWheel)
    wheel: RouletteWheel = null;

    onLoad() {
        this.quickBet.callback.highlight = (highlight, numbers) => {
            this.board.internalHighlight(highlight, numbers);
        }
    }

    switchToQuickBet() {

    }

    switchToRegularBet() {

    }

    showRoulette() {

    }

    hideRoulette() {

    }
}
