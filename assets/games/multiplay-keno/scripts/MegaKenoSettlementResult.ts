import GameUtils from "../../../common/GameUtils";
import KenoSettlementWinChoices from "../../mini-keno/view-models/KenoSettlementWinChoices";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MegaKenoSettlementResult extends cc.Component {
    @property(cc.Animation)
    animation: cc.Animation = null;

    @property(cc.Node)
    numberContainer: cc.Node = null;

    @property(KenoSettlementWinChoices)
    settlementChoices: KenoSettlementWinChoices = null;

    numberLabels: cc.Label[] = [];

    onLoad() {
        this.numberLabels = this.numberContainer.getComponentsInChildren(cc.Label);
    }

    hide() {
        GameUtils.hideNode(this.node, 0.3);
    }

    show() {
        this.node.active = true;
        this.node.opacity = 255;
    }

    playResultAnimation(settlement: any, onComplete: () => void) {
        const { result, settlementResult } = settlement;

        this.setResultsNumber(result);
        this.settlementChoices.setSettlement(settlementResult);

        this.animation.clear();
        this.animation.on("finished", onComplete);
        this.animation.play();
    }

    setResultsNumber(results: number[]) {
        const half = results.length / 2;
        results.forEach((result, index) => {
            const isLeft = index < half;
            const labelIndex = isLeft ? index * 2 : (index - half) * 2 + 1;
            this.numberLabels[labelIndex].string = result.toString();
        });
    }
}
