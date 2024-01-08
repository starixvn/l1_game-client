import GameUtils from "../../../common/GameUtils";
import BetChipsNew from "../../../common/bet-chips/view-models/BetChipsNew";
import ChipConfig from "../../../common/bet-chips/view-models/ChipConfig";
import { CardModel } from "../../../common/new-card/view-models/NewCard";
import BlackJack from "../../blackjack/view-models/BlackJack";
import IngameActionHandler from "../../blackjack/view-models/handlers/IngameActionHandler";
import ChineseBlackjackDealHandler from "./handlers/ChineseBlackjackDealHandler";
import ChineseBlackjackFinishHandler from "./handlers/ChineseBlackjackFinishHandler";
import ChineseBlackjackInGameHandler from "./handlers/ChineseBlackjackInGameHandler";
const { ccclass, property } = cc._decorator;

export const ChineseBlackjackId = 77;

@ccclass
export default class ChineseBlackjack extends BlackJack {
    @property({ type: cc.Node, visible: false, override: true })
    splitButton: cc.Node = null;

    @property({ type: cc.Node, visible: false, override: true })
    doubleButton: cc.Node = null;

    @property(cc.Label)
    fiveCardsOddsLabel: cc.Label = null;

    protected moveCardDuration = 0.35;
    chipJumpHeight = 250;
    betChips: BetChipsNew;

    constructor() {
        super();
        this.gameId = ChineseBlackjackId;
    }

    public get chipConfig() {
        return ChipConfig.getInstance();
    }

    dealerOpenFirstCard(card: CardModel, duration: number) {
        this.dealHander = new ChineseBlackjackDealHandler(this);
        this.ingameActionHander = new IngameActionHandler(this);
        this.finishHandler = new ChineseBlackjackFinishHandler(this);
        this.ingameHander = new ChineseBlackjackInGameHandler(this);
    }

    updateOdds() {
        const ChineseBlackjackOdds = `${GameUtils.roundFixed(+this.gameConfigs.odds.ChineseBlackjack - 1, 2)}`;
        this.blackjackOddLabel.string = GameUtils.getText("ChineseBlackjack.ban-ban_pays", {
            odds: ChineseBlackjackOdds
        }).toUpperCase();

        const fiveCardsOdds = `${GameUtils.roundFixed(+this.gameConfigs.odds.fiveCardTrick - 1, 2)}`;
        this.fiveCardsOddsLabel.string = GameUtils.getText("ChineseBlackjack.five-cards_pays", {
            odds: fiveCardsOdds
        }).toUpperCase();
    }
}
