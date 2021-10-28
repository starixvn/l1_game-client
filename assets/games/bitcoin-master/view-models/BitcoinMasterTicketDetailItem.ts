import GameUtils from "../../../common/GameUtils";
import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { BitcoinMasterBetType } from "./BitcoinMasterCommon";
import BitcoinMasterUpDownResultDetail from "./BitcoinMasterUpDownResultDetail";
import BitcoinMasterUtils from "./BitcoinMasterUtils";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterTicketDetailItem extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(BitcoinMasterUpDownResultDetail)
    upDownResult: BitcoinMasterUpDownResultDetail = null;

    @property(cc.Node)
    evenOddResult: cc.Node = null;

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
                this.evenOddResult.active = false;
                break;
            default:
                this.upDownResult.node.active = false;
                const evenOddValue = parseInt(BitcoinMasterUtils.getEvenOddResult(result.close));
                const message =
                    evenOddValue % 2
                        ? GameUtils.getBetChoiceString(BitcoinMasterBetType.odd)
                        : GameUtils.getBetChoiceString(BitcoinMasterBetType.even);

                this.evenOddResult.getChildByName("result").getComponent(cc.Label).string = message;
                this.evenOddResult.getChildByName("number").getComponent(cc.Label).string = ` (${evenOddValue})`;
        }
    }
}
