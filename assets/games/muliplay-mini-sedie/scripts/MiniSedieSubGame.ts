import GameUtils, { MINI_GAMES_SCALE_ON_DESKTOP } from "../../../common/GameUtils";
import MiniSedie from "./MiniSedie";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedieSubGame extends MiniSedie {
    @property({ type: cc.Sprite })
    chips: cc.Sprite[] = [];

    @property(cc.Node)
    chipResult: cc.Node = null;

    openPlatePos = cc.v2(20, 40);

    setBlurDishAndHideDices() {
        this.animation.node.opacity = 0;
    }

    handleAfterSettlementResult(settlement: any, animated: boolean) {
        this.showWinChoiceAndUpdateHistory(settlement);

        const doLaterPayOut = () => {
            this.highlightAndPayout(settlement);
        };

        const doLaterBlurDish = () => {
            this.setChipsResult(settlement.result);
            cc.tween(this.animation.node)
                .to(0.5, { scale: 0.6, position: cc.v2(0, -88) }, { easing: "easeInOutBack" })
                .start();
        };

        // const doLaterShowResult = () => {
        //     this.setChipsResult(settlement.result);
        //     cc.tween(this.chipResult).delay(0.2).to(0.8, { scale: 1, opacity: 255 }, { easing: "sineInOut" }).start();
        // };

        if (animated) {
            this.scheduleOnce(doLaterPayOut, 1.5);
            this.scheduleOnce(doLaterBlurDish, 2.5);
            //this.scheduleOnce(doLaterShowResult, 2.3);
        } else {
            this.showDicesAndPlates();
            this.dishNode.opacity = 0;
            this.highlightAndPayout(settlement);
        }
    }

    initMiniRoundHistory(node: cc.Node) {
        super.initMiniRoundHistory(node);
        this.miniRoundHistory.tip.node.opacity = 0;
    }

    customScaleNode(node: cc.Node) {
        node.scale = !cc.sys.isMobile ? MINI_GAMES_SCALE_ON_DESKTOP : 1;
    }

    showAcceptedBet(bet: number) {
        const node = GameUtils.addFlyingText(this.noticeNode, false, bet, 1);
        this.customScaleNode(node);
    }

    showWinningBet(bet: number) {
        const node = GameUtils.addFlyingText(this.noticeNode, true, bet, 4);
        node.name = "winningBet";
        this.customScaleNode(node);
    }

    setChipsResult(result) {
        Object.keys(result).forEach((key, index) => {
            const frameName = result[key] ? "chip_do" : "chip_trang";
            this.chips[index].spriteFrame = this.mainAtlas.getSpriteFrame(frameName);
        });
    }

    // showOriginalDish() {
    //     cc.tween(this.animation.node).to(0.2, { opacity: 0, scale: 0 }, { easing: "sineInOut" }).delay(0.2).start();
    //     super.showOriginalDish();
    // }
}
