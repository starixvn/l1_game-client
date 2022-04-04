import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import SedieBetOptionHistoryPortrait from "./SedieBetOptionHistoryPortrait";
import SedieHistoryItem from "./SedieHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieHistoryPortraitItem extends SedieHistoryItem {
    @property(cc.Node)
    betOption: cc.Node = null;

    @property(cc.Prefab)
    betOptionPrefab: cc.Prefab = null;

    @property(cc.Node)
    lineBottom: cc.Node = null;

    private heightEachBetOption = 28;
    private positionBetOption = -25;

    setData(betLog: any) {
        const { freeBet, settlementResult, odds } = betLog;

        Object.keys(settlementResult).forEach((choice) => {
            const betOption = cc.instantiate(this.betOptionPrefab);
            const control = betOption.getComponent(SedieBetOptionHistoryPortrait);
            const stake = betLog[choice];
            if (+stake > 0) {
                control.handleBetOptionItem(choice, numberWithCommas(odds[choice]), numberWithCommas(stake));
                this.betOption.addChild(betOption);
            }

            // historyItem.string = freeBet ? 0 : numberWithCommas(betLog[choice]);

            // if (settlementResult[choice]) {
            //     historyItem.node.color = cc.Color.YELLOW;
            // } else {
            //     historyItem.node.color = cc.Color.WHITE;
            // }
        });
        this.setSizeAndPosition(this.betOption);
    }
    setSizeAndPosition(betOption: cc.Node) {
        betOption.children.forEach((item, index) => {
            item.y = (index + 1) * this.positionBetOption;
        });
        if (betOption.children.length >= 2) {
            this.node.height = 70 + (this.betOption.children.length - 2) * this.heightEachBetOption;
            this.lineBottom.y = (this.node.height * -1) / 2;
            this.betOption.y = this.node.height / 2;
        }
    }
}
