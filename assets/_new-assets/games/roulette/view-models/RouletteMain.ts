import RouletteBoard from "./RouletteBoard";
import RouletteQuickBet from "./RouletteQuickBet";
import RouletteWheel from "./RouletteWheel";
import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import { RouletteBetInfo } from "./Roulette";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteMain extends cc.Component {
    @property(RouletteBoard)
    board: RouletteBoard = null;

    @property(RouletteQuickBet)
    quickBet: RouletteQuickBet = null;

    @property(RouletteWheel)
    wheel: RouletteWheel = null;

    @property(cc.Node)
    timeWaitNode: cc.Node = null;

    @property(cc.Label)
    timeWaitLabel: cc.Label = null;

    @property({ type: AnimatedTime })
    animatedTime: AnimatedTime = null;

    betList: RouletteBetInfo[] = [];


    onLoad() {
        this.quickBet.callback.highlight = (highlight, numbers) => {
            this.board.internalHighlight(highlight, numbers);
        }
    }

    switchToQuickBet() {

    }

    switchToRegularBet() {
        this.board.clearHighlight();
    }

    showRoulette(result: number, onComplete: () => void) {
        this.wheel.showResult(result, () => {
            this.hideRoulette();
            onComplete();
        });
    }

    hideRoulette() {

    }

    highlightLastResult(result: number) {
        this.board.highlightLastResult(result);
    }
}
