import GameUtils from "../../../common/GameUtils";
import MiniRoundHistoryTip from "../../../common/mini-round-history/MiniRoundHistoryTip";
import { BMBetType } from "./BitcoinMasterCommon";
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
        if (data.settlementResult[BMBetType.Even]) {
            choiceKey = betChoices[BMBetType.Even];
        } else if (data.settlementResult[BMBetType.Odd]) {
            choiceKey = betChoices[BMBetType.Odd];
        }

        const betChoice = GameUtils.getBetChoiceString(choiceKey);
        this.result.string = `${data.result.close} - ${betChoice} (${evenOddValue})`;
    }
}
