import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import { RouletteBetInfo } from "./Roulette";
import RouletteBoard from "./RouletteBoard";
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

    @property(cc.Node)
    timeWaitNode: cc.Node = null;

    @property(cc.Label)
    timeWaitLabel: cc.Label = null;

    @property({ type: AnimatedTime })
    animatedTime: AnimatedTime = null;

    @property(cc.Node)
    backgroundWheel: cc.Node = null;

    betList: RouletteBetInfo[] = [];

    protected wheelHidePositionY = 1000;

    onLoad() {
        this.quickBet.callback.highlight = (highlight, numbers) => {
            this.board.internalHighlight(highlight, numbers);
        }

        this.backgroundWheel.active = false;
        this.wheel.node.y = this.wheelHidePositionY;
    }

    enableQuickBet(enable: boolean) {

    }

    switchToQuickBet() {

    }

    switchToRegularBet() {
    }

    showRoulette(result: number, onComplete: () => void) {
        this.wheel.showResult(result, () => {
            cc.tween(this.node)
                .call(onComplete)
                .delay(2)
                .call(() => this.hideRoulette())
                .start();
        });

        this.backgroundWheel.active = true;
        this.wheel.node.active = true;
        this.wheel.node.runAction(cc.moveTo(0.5, cc.v2(0, 35)));
    }

    hideRoulette() {
        this.wheel.hideResultNumber();
        this.wheel.node.runAction(cc.sequence(
            cc.moveTo(0.5, cc.v2(0, this.wheelHidePositionY)),
            cc.callFunc(() => {
                this.backgroundWheel.active = false;
                this.wheel.node.active = false;
            })
        ));
    }

    highlightLastResult(result: number, animated: boolean) {
        this.board.highlightLastResult(result, animated);
    }
}
