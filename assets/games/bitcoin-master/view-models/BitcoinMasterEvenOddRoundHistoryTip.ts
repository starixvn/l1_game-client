import GameUtils from "../../../common/GameUtils";
import MiniRoundHistoryTip from "../../../common/mini-round-history/MiniRoundHistoryTip";
import { BitcoinMasterBetType } from "./BitcoinMasterCommon";
import BitcoinMasterUtils from "./BitcoinMasterUtils";

const { ccclass } = cc._decorator;

@ccclass
export default class BitcoinMasterEvenOddRoundHistoryTip extends MiniRoundHistoryTip {
    public setData(data: any) {
        this.roundId.string = `#${data.roundId}`;
        const evenOddValue = BitcoinMasterUtils.getEvenOddResult(data.result.close);

        const betChoices = {
            even: "even",
            odd: "odd"
        };

        let choiceKey = "";
        if (data.settlementResult[BitcoinMasterBetType.even]) {
            choiceKey = betChoices[BitcoinMasterBetType.even];
        } else if (data.settlementResult[BitcoinMasterBetType.odd]) {
            choiceKey = betChoices[BitcoinMasterBetType.odd];
        }

        const betChoice = GameUtils.getBetChoiceString(choiceKey);
        this.result.string = `${data.result.close} - ${betChoice} (${evenOddValue})`;
    }
}
