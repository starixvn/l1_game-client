const { ccclass, property } = cc._decorator;

import * as _ from "lodash";
import RouletteTicketDetailItem from "./RouletteTicketDetailItem";
import { RouletteBetType } from './Roulette';

@ccclass
export default class RouletteTicketDetailIGroup extends cc.Component {
    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Node)
    betChoiceGroupNode: cc.Node = null;

    @property(cc.Prefab)
    betItemPrefab: cc.Prefab = null;

    onLoad() {
        this.betChoiceGroupNode.children.forEach(child => child.destroy());
    }

    createBetLogItem(betLogs: any, settlementResult: any) {
        let height = 0;
        const straightUpArray = _.pick(betLogs, RouletteBetType.StraightUp);
        const splitUpArray = _.pick(betLogs, RouletteBetType.Split);
        const streetUpArray = _.pick(betLogs, RouletteBetType.Street);
        const triangleUpArray = _.pick(betLogs, RouletteBetType.Triangle);
        const cornerUpArray = _.pick(betLogs, RouletteBetType.Corner);
        const fourNumberUpArray = _.pick(betLogs, RouletteBetType.FourNumbers);
        const lineUpArray = _.pick(betLogs, RouletteBetType.Line);
        const columnUpArray = _.pick(betLogs, RouletteBetType.Column);
        const dozenUpArray = _.pick(betLogs, RouletteBetType.Dozen);
        const redBlackArray = _.pick(betLogs, RouletteBetType.RedBlack);
        const oddEvenArray = _.pick(betLogs, RouletteBetType.OddEven);
        const bigSmallArray = _.pick(betLogs, RouletteBetType.BigSmall);
        const orderResults = _.merge(straightUpArray, splitUpArray, streetUpArray, triangleUpArray, cornerUpArray,
            fourNumberUpArray, lineUpArray, columnUpArray, dozenUpArray, redBlackArray, oddEvenArray, bigSmallArray);

        Object.keys(orderResults).forEach(keyGroup => {
            const betList = betLogs[keyGroup];
            const result = _.hasIn(settlementResult, keyGroup) ? _.pick(settlementResult, keyGroup) : null;

            if (_.size(betList) > 0) {
                Object.keys(betList).forEach(logKey => {
                    const betItem = cc.instantiate(this.betItemPrefab);
                    const betItemComponent = betItem.getComponent(RouletteTicketDetailItem);
                    this.betChoiceGroupNode.addChild(betItem);
                    const isWinning = result[keyGroup].indexOf(logKey) != -1;
                    betItemComponent.updateContent(keyGroup, logKey, betList[logKey], isWinning);
                    height += betItemComponent.height;
                })
            }
        });

        this.node.height = height;
    }
}
