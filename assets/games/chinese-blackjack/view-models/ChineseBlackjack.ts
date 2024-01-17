import GameUtils from "../../../common/GameUtils";
import BetChipsNew from "../../../common/bet-chips/view-models/BetChipsNew";
import ChipConfig from "../../../common/bet-chips/view-models/ChipConfig";
import NewButton from "../../../common/custom-button/NewButton";
import { CardModel } from "../../../common/new-card/view-models/NewCard";
import { uiManager } from "../../../managers/GameUIManager";
import BlackJack, { BlackJackActionType } from "../../blackjack/view-models/BlackJack";
import IngameActionHandler from "../../blackjack/view-models/handlers/IngameActionHandler";
import ChineseBlackjackHandPlace from "./ChineseBlackjackHandPlace";
import ChineseBlackjackDealHandler from "./handlers/ChineseBlackjackDealHandler";
import ChineseBlackjackFinishHandler from "./handlers/ChineseBlackjackFinishHandler";
import ChineseBlackjackInGameHandler from "./handlers/ChineseBlackjackInGameHandler";
const { ccclass, property } = cc._decorator;

export const ChineseBlackjackId = 77;
export const CHINESE_BLACKJACK_STAND_CLICK = "CHINESE_BLACKJACK_STAND_CLICK";

@ccclass
export default class ChineseBlackjack extends BlackJack {
    @property({ type: ChineseBlackjackHandPlace, override: true })
    handPlaces: ChineseBlackjackHandPlace[] = [];

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

    setupSpecialHandler() {
        this.dealHander = new ChineseBlackjackDealHandler(this);
        this.ingameActionHander = new IngameActionHandler(this);
        this.finishHandler = new ChineseBlackjackFinishHandler(this);
        this.ingameHander = new ChineseBlackjackInGameHandler(this);
    }

    dealerOpenFirstCard(card: CardModel, duration: number) {
        this.dealerOpenCard(card, duration, 0);
    }

    updateOdds() {
        const ChineseBlackjackOdds = `${GameUtils.roundFixed(+this.gameConfigs.odds.banBan - 1, 2)}`;
        this.blackjackOddLabel.string = GameUtils.getText("ChineseBlackjack.ban-ban_pays", {
            odds: ChineseBlackjackOdds
        }).toUpperCase();

        const fiveCardsOdds = `${GameUtils.roundFixed(+this.gameConfigs.odds.fiveCardTrick - 1, 2)}`;
        this.fiveCardsOddsLabel.string = GameUtils.getText("ChineseBlackjack.five-cards_pays", {
            odds: fiveCardsOdds
        }).toUpperCase();
    }

    switchToNextHand() {
        const nextHand = this.handPlaces.find((hand) => hand.isActive && !hand.isStand);
        if (nextHand) {
            if (this.activeHand !== nextHand) {
                this.activeHand = nextHand;
            }

            nextHand.selected = true;
            this.showActionsWithBehavior(BlackJackActionType.IN_ROUND);
        } else {
            this.switchToDealer();
            this.inRoundActionVisibility(false);
        }

        this.updateAvailableActions();
    }

    initHandPlaces() {
        super.initHandPlaces();
        this.handPlaces.forEach((handPlace) => {
            handPlace.standClickCallback = () => {
                this.onStandClick();
            };
        });
    }

    setupButtonCallbacks() {
        this.standButton && (this.standButton.getComponent(NewButton).callback.selected = () => this.onStandClickCustomize());
        this.hitButton && (this.hitButton.getComponent(NewButton).callback.selected = () => this.onHitClick());
        this.newBetButton && (this.newBetButton.getComponent(NewButton).callback.selected = () => this.onNewBetClick());
        this.rebetAndDealButton && (this.rebetAndDealButton.getComponent(NewButton).callback.selected = () => this.onRebetClick());
        this.clearButton && (this.clearButton.getComponent(NewButton).callback.selected = () => this.onClearClick());
        this.dealButton && (this.dealButton.getComponent(NewButton).callback.selected = () => this.onDealClick());
    }

    onStandClickCustomize() {
        uiManager.emitter.emit(CHINESE_BLACKJACK_STAND_CLICK, true);
    }
}
