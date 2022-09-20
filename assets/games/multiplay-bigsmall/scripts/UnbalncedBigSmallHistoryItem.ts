import { i18n } from "../../../ClientModules";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import MultiplayGameHistoryItem from "../../multiplay/scripts/MultiplayGameHistoryItem";
import MultiplayGameHistoryResult from "./MultiplayGameHistoryResult";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalncedBigSmallHistoryItem extends MultiplayGameHistoryItem {
    @property(cc.Label)
    betChoice: cc.Label = null;

    @property(cc.Node)
    result: cc.Node = null;

    @property(cc.Prefab)
    resultPrefab: cc.Prefab = null;

    @property(cc.Label)
    stake: cc.Label = null;

    setData(data: any, index: number) {
        super.setData(data, index);
        this.stake.string = numberWithCommas(data.totalAmount, 2);
        const result = data.result;
        this.setResultData(result);
        const winChoice = +data.big > 0 ? "big" : "small";
        const textWinChoice = i18n.t(`ui.choice_${winChoice}`);
        this.betChoice.string = textWinChoice.toUpperCase();
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
