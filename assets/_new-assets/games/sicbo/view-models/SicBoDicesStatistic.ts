import SicBo from "./SicBo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SicBoDicesStatistic extends cc.Component {

    @property(cc.Label)
    dice1Percentage: cc.Label = null;

    @property(cc.Label)
    dice2Percentage: cc.Label = null;

    @property(cc.Label)
    dice3Percentage: cc.Label = null;

    @property(cc.Label)
    dice4Percentage: cc.Label = null;

    @property(cc.Label)
    dice5Percentage: cc.Label = null;

    @property(cc.Label)
    dice6Percentage: cc.Label = null;
    @property
    text: string = 'hello';

    private dataLogs = [];

    init(sicbo: SicBo) {
        this.dataLogs = sicbo.currentDataLogs;
        this.updateData();
    }

    updateData() {
        
    }
    // update (dt) {}
}
