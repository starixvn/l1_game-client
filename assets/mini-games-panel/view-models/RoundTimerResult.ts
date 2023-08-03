import CustomeRoundTimerResult from "./CustomeRoundTimerResult";
import RoundTimerResultText from "./RoundTimerResultText";

const { ccclass, property } = cc._decorator;

export enum RoundTimerResultType {
    TEXT = 0,
    SPRITE
}

@ccclass
export default class RoundTimerResult extends cc.Component {
    @property({ type: cc.Enum(RoundTimerResultType) })
    resultType = RoundTimerResultType.TEXT;

    @property(cc.Prefab)
    customResultPrefab: cc.Prefab = null;

    public betOptions;
    private customResultNode: cc.Node;

    onLoad() {
        this.node.destroyAllChildren();
        this.customResultNode = cc.instantiate(this.customResultPrefab);
        this.node.addChild(this.customResultNode);
    }

    setResult(data) {
        this.resultType === RoundTimerResultType.TEXT ? this.loadText(data) : this.loadCustomResult(data);
    }

    loadCustomResult(data) {
        const customResult = this.customResultNode.getComponent(CustomeRoundTimerResult);
        customResult.show(data);
    }

    loadText(data) {
        const customResult = this.customResultNode.getComponent(RoundTimerResultText);
        customResult.show(data, this.betOptions);
    }
}
