import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import GameBetHistoryBase from "../../_base/view-models/GameBetHistoryBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterBetHistory extends GameBetHistoryBase {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Node)
    upDownGeneralInfoNode: cc.Node = null;

    @property(cc.Label)
    openValue: cc.Label = null;

    @property(cc.Label)
    closeValue: cc.Label = null;

    @property(cc.Node)
    upDownResultDetail: cc.Node = null;

    @property(cc.Node)
    oddEvenGeneralInfoNode: cc.Node = null;

    @property(cc.Label)
    evenOddResult: cc.Label = null;

    @property(cc.Node)
    evenOddResultDetail: cc.Node = null;

    onData(data: any) {
        super.onData(data);
        const { id, time, result, total, settlementResult } = data;
        this.roundIdLabel.string = `#${data.id}`;
        this.time.string = getStringDateByTime(time);
        this.openValue.string = result.open;
        this.closeValue.string = result.close;
    }
}
