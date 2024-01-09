import GameUtils from "../../../common/GameUtils";
import BlackJackHistoryItem from "../../blackjack/view-models/BlackJackHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChineseBlackjackHistoryItem extends BlackJackHistoryItem {
    @property({ type: cc.Node, override: true, visible: false })
    split: cc.Node = null;

    @property({ type: cc.Label, override: true, visible: false })
    round: cc.Label = null;

    convertResult(resultLabel: cc.Label, result: number, array: any) {
        if (resultLabel) {
            if (result > 21) {
                resultLabel.string = GameUtils.getText(`ChineseBlackjack.glossary_bust`);
            } else if (result === 21 && array.length === 2) {
                resultLabel.string = GameUtils.getText(`ChineseBlackjack.glossary_hand_ranking_ban-ban`);
            } else if (result <= 21 && array.length === 5) {
                resultLabel.string = GameUtils.getText(`ChineseBlackjack.hand_ranking_five-card_trick`);
            } else {
                resultLabel.string = result.toString();
            }
        }
    }
}
