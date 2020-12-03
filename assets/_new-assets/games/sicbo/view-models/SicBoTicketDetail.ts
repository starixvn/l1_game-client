import * as _ from "lodash";
import { getStringHourByTime } from '../../../common/helpers/Helper';
import SicBoTicketDetailItem from "./SicBoTicketDetailItem";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoTicketDetail extends cc.Component {

    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Sprite)
    dices: cc.Sprite[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    ticketDetailItemPrefab: cc.Prefab = null;

    @property(cc.Label)
    total: cc.Label = null;

    roundID: number;
    result: number;
    betLogDetails = null;
    settlementResult = null;

    onLoad() {
        this.content.children.forEach(child => child.destroy());
    }

    public setData(betLogDetails: any, settlementResult: any) {
        this.betLogDetails = betLogDetails;
        this.settlementResult = settlementResult;
    }

    public showbetLogs() {
        this.node.active = true;
        for(const betLogDetail of this.betLogDetails){
            const ticketDetailItem = cc.instantiate(this.ticketDetailItemPrefab);
            const ticketDetailItemComponent = ticketDetailItem.getComponent(SicBoTicketDetailItem);
            ticketDetailItemComponent.updateContent(betLogDetail, this.settlementResult);
            this.content.addChild(ticketDetailItem);
        }
    }

    onDisable() {
        this.content.destroyAllChildren();
        this.node.destroy();
    }
}
