import GameUtils from "../../common/GameUtils";
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

    @property({
        type: cc.Prefab,
        visible: function (this: RoundTimerResult) {
            return this.resultType === RoundTimerResultType.SPRITE;
        }
    })
    customResultPrefab: cc.Prefab = null;

    public betOptions;
    private customResultNode: cc.Node;

    onLoad() {
        this.node.destroyAllChildren();
        this.initCustomResult();
    }

    private async initCustomResult() {
        if (this.resultType === RoundTimerResultType.TEXT) {
            this.customResultPrefab = await GameUtils.loadResource(`minipanel/popup-mini-game/RoundTimerResultText`);
        }

        this.customResultNode = cc.instantiate(this.customResultPrefab);
        this.node.addChild(this.customResultNode);
    }

    setResult(data) {
        if (!this.customResultNode) {
            return;
        }
        this.resultType === RoundTimerResultType.TEXT ? this.loadText(data) : this.loadCustomResult(data);
    }

    private loadCustomResult(data) {
        const customResult = this.customResultNode.getComponent(CustomeRoundTimerResult);
        customResult.show(data);
    }

    private loadText(data) {
        const customResult = this.customResultNode.getComponent(RoundTimerResultText);
        customResult.show(data, this.betOptions);
    }
}
