import { getStringHourByTime } from '../../../common/helpers/Helper';
import RouletteTicketDetailIGroup from './RouletteTicketDetailIGroup';


const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteTicketDetail extends cc.Component {

    @property(cc.Label)
    roundLabel: cc.Label = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    groupPrefab: cc.Prefab = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    roundID: number = 2000;
    result: number = 20;
    betLogDetails = null;
    settlementResult = null;

    onLoad() {
        this.content.children.forEach(child => child.destroy());

        const commonDialog = this.mainFrame.getComponent('CommonDialog');
        commonDialog.onDidHide = () => { this.node.destroy(); };
    }

    public setData(betLogDetails: any, settlementResult: any) {
        this.betLogDetails = betLogDetails;
        this.settlementResult = settlementResult;
    }

    public showbetLogs() {
        this.node.active = true;
        this.betLogDetails.forEach(log => {
            const group = cc.instantiate(this.groupPrefab);
            const groupComponent = group.getComponent(RouletteTicketDetailIGroup);
            groupComponent.timeLabel.string = getStringHourByTime(log.time);
            this.content.addChild(group);
            groupComponent.createBetLogItem(log, this.settlementResult);
        })
    }
}
