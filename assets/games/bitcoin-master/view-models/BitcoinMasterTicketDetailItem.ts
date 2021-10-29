import GameUtils from "../../../common/GameUtils";
import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { BitcoinMasterBetType } from "./BitcoinMasterCommon";
import BitcoinMasterEvenOddResultDetail from "./BitcoinMasterEvenOddResultDetail";
import BitcoinMasterUpDownResultDetail from "./BitcoinMasterUpDownResultDetail";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(BitcoinMasterUpDownResultDetail)
    upDownResult: BitcoinMasterUpDownResultDetail = null;

    @property(BitcoinMasterEvenOddResultDetail)
    evenOddResult: BitcoinMasterEvenOddResultDetail = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    refund: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Node)
    lineBottom: cc.Node = null;

    setData(log: any, result: any) {
        this.time.string = getStringDateByTime(log.time);
        this.choice.string = GameUtils.getBetChoiceString(log.choice);

        this.bet.string = numberWithCommas(log.amount);
        this.refund.string = numberWithCommas(log.refund);
        this.win.string = numberWithCommas(log.betwin);

        switch (log.choice) {
            case BitcoinMasterBetType.up:
            case BitcoinMasterBetType.down:
                this.upDownResult.setData(result);
                this.evenOddResult.node.active = false;
                break;
            default:
                this.upDownResult.node.active = false;
                this.evenOddResult.setData(result.close);
        }
    }
}
