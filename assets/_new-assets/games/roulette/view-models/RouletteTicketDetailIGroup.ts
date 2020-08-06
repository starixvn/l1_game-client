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

    createBetLogItem(betLogs) {
        let height = 0;
        Object.keys(betLogs).forEach(keyGroup => {
            if (keyGroup !== "time") {
                let betList = betLogs[keyGroup]
                if (_.size(betList) > 0) {
                    Object.keys(betList).forEach(logKey => {
                        let betItem = cc.instantiate(this.betItemPrefab);
                        let betItemComponent = betItem.getComponent(RouletteTicketDetailItem);
                        this.betChoiceGroupNode.addChild(betItem);
                        betItemComponent.updateContent(keyGroup, logKey, betList[logKey]);
                        height += betItemComponent.height;
                    })
                }
            }
        });

        this.node.height = height;
    }
}
