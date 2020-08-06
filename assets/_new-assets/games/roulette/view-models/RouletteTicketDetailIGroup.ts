const { ccclass, property } = cc._decorator;

import RouletteTicketDetailItem from "./RouletteTicketDetailItem";

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

    createBetLogItem() {
        let betItem = cc.instantiate(this.betItemPrefab);
        let betItemComponent = betItem.getComponent(RouletteTicketDetailItem);
        this.betChoiceGroupNode.addChild(betItem);
        betItemComponent.updateContent();
        this.node.height = betItemComponent.height;
    }
}
