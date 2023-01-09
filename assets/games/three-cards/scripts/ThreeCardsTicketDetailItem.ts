import GameUtils from "../../../common/GameUtils";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThreeCardsTicketDetailItem extends cc.Component {
    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    odds: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Node)
    bottomLine: cc.Node = null;

    start() {
        GameUtils.setFontSizeLabelsInNode(this.node);
    }

    showBackground(show: boolean) {
        this.bg.active = show;
    }

    setData({ choice, odds, bet }) {
        this.choice.string = GameUtils.getBetChoiceString(choice);
        this.odds.string = cc.RedT?.user?.fractionalOddsFormat ? numberWithCommas(+odds - 1, 2) : odds;
        this.bet.string = numberWithCommas(bet);
    }

    setHighlight(highlight: boolean) {
        const color = highlight ? cc.Color.YELLOW : cc.Color.WHITE;
        this.choice.node.color = color;
        this.odds.node.color = color;
        this.bet.node.color = color;
    }
}
