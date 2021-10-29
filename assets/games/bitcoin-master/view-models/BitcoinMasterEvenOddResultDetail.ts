import GameUtils from "../../../common/GameUtils";
import { BitcoinMasterBetType } from "./BitcoinMasterCommon";
import BitcoinMasterUtils from "./BitcoinMasterUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterEvenOddResultDetail extends cc.Component {
    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Label)
    number: cc.Label = null;

    protected evenOddValue = 0;

    setColor() {
        const color = cc.Color.WHITE;
        const convertColor = this.evenOddValue % 2 ? color.fromHEX("#F3485F") : color.fromHEX("#bac5ca");
        this.result.node.color = convertColor;
        this.number.node.color = convertColor;
    }

    setData(result: number) {
        const evenOddValue = parseInt(BitcoinMasterUtils.getEvenOddResult(result));
        this.evenOddValue = evenOddValue;
        const message =
            evenOddValue % 2
                ? GameUtils.getBetChoiceString(BitcoinMasterBetType.odd)
                : GameUtils.getBetChoiceString(BitcoinMasterBetType.even);

        this.result.string = message;
        this.number.string = ` (${evenOddValue})`;
    }
}
