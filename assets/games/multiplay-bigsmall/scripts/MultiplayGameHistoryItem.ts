import { getStringHourByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import MultiplayGameHistoryResult from "./MultiplayGameHistoryResult";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayGameHistoryItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    betChoice: cc.Label = null;

    @property(cc.Node)
    result: cc.Node = null;

    @property(cc.Prefab)
    resultPrefab: cc.Prefab = null;

    @property(cc.Label)
    stake: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    setData(data: any) {
        this.time.string = getStringHourByTime(data.time);
        this.round.string = data.roundId;
        this.win.string = numberWithCommas(data.betwin, 2);
        this.stake.string = data.totalAmount;
        const result = data.result;
        this.setResultData(result);
        this.betChoice.string = +data.big > 0 ? "BIG" : "SMALL";
        if (data.betwin > 0) {
            this.stake.node.color = this.betChoice.node.color = cc.Color.BLACK.fromHEX("fff663");
        }
    }

    setResultData(result: any) {
        const resultNode = cc.instantiate(this.resultPrefab);
        const resultControl = resultNode.getComponent(MultiplayGameHistoryResult);
        resultControl.setResult(result);
        this.result.addChild(resultNode);
    }
}
