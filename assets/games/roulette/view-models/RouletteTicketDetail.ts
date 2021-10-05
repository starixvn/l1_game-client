import { getStringHourByTime } from "../../../common/helpers/DateTimeHelper";
import GameTicketDetailBase from "../../_base/view-models/GameTicketDetailBase";
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

    roundID: number = 2000;
    result: number = 20;

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

    setRouletteData(round: number, result: number) {
        this.roundLabel.string = round.toString();
        this.resultLabel.string = result.toString();
    }
}
