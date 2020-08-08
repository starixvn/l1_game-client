import * as _ from "lodash";
import RouletteTicketDetailItem from "./RouletteTicketDetailItem";

const { ccclass, property } = cc._decorator;

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
        Object.keys(betLogs).forEach(keyGroup => {
            if (keyGroup !== "time") {
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
            }
        });

        this.node.height = height;
    }
}
