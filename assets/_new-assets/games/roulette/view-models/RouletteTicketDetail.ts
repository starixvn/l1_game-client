import { getStringHourByTime } from "../../../common/helpers/Helper";
import GameTicketDetailBase from "../../_base/GameTicketDetailBase";
import RouletteTicketDetailIGroup from "./RouletteTicketDetailIGroup";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteTicketDetail extends GameTicketDetailBase {
    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    @property(cc.Prefab)
    groupPrefab: cc.Prefab = null;

    roundID = 2000;
    result = 20;

    public showbetLogs() {
        this.node.active = true;
        this.betLogDetails.forEach((log) => {
            const group = cc.instantiate(this.groupPrefab);
            const groupComponent = group.getComponent(RouletteTicketDetailIGroup);
            groupComponent.timeLabel.string = getStringHourByTime(log.time);
            this.content.addChild(group);
            groupComponent.createBetLogItem(log, this.settlementResult);
        });
    }
}
