const { ccclass, property } = cc._decorator;

import * as _ from "lodash";
import RouletteTicketDetailItem from "./RouletteTicketDetailItem";
import { RouletteBetType } from "./Roulette";

@ccclass
export default class RouletteTicketDetailIGroup extends cc.Component {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    betChoiceGroupNode: cc.Node = null;

    @property(cc.Prefab)
    betItemPrefab: cc.Prefab = null;

    onLoad() {
        this.betChoiceGroupNode.children.forEach((child) => child.destroy());
    }

    onDisable() {
        this.betChoiceGroupNode.destroyAllChildren();
    }

    createBetLogItem(betLogs: any, settlementResult: any) {
        let height = 0;
        const orderDictionary = [
            RouletteBetType.StraightUp,
            RouletteBetType.Split,
            RouletteBetType.Street,
            RouletteBetType.Triangle,
            RouletteBetType.Corner,
            RouletteBetType.FourNumbers,
            RouletteBetType.Line,
            RouletteBetType.Column,
            RouletteBetType.Dozen,
            RouletteBetType.RedBlack,
            RouletteBetType.OddEven,
            RouletteBetType.BigSmall
        ];

        const orderResults = {};
        orderDictionary.forEach((key) => {
            if (betLogs[key]) {
                orderResults[key] = betLogs[key];
            }
        });

        Object.keys(orderResults).forEach((betType) => {
            const betList = orderResults[betType];
            const result = settlementResult[betType];

            if (_.size(betList) > 0) {
                Object.keys(betList).forEach((betKey) => {
                    const betItem = cc.instantiate(this.betItemPrefab);
                    const betItemComponent = betItem.getComponent(RouletteTicketDetailItem);
                    this.betChoiceGroupNode.addChild(betItem);
                    const isWinning = result && result.indexOf(betKey) !== -1;
                    betItemComponent.updateContent(betType, betKey, betList[betKey], isWinning);
                    height += betItemComponent.height;
                });
            }
        });

        this.node.height = height;
    }
}
