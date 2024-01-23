import GameUtils from "../../../common/GameUtils";
import { getLanguage, getLocale } from "../../../common/auth/SessionManager";
import BetChipsNew from "../../../common/bet-chips/view-models/BetChipsNew";
import ChipConfig from "../../../common/bet-chips/view-models/ChipConfig";
import FadeEffectButton from "../../../common/custom-button/FadeEffectButton";
import NewButton from "../../../common/custom-button/NewButton";
import { CardModel } from "../../../common/new-card/view-models/NewCard";
import WebViewGuide from "../../../common/webview-guide/WebViewGuide";
import { uiManager } from "../../../managers/GameUIManager";
import ProvablyFair from "../../_casino/ProvablyFair";
import BlackJack, { BlackJackActionType } from "../../blackjack/view-models/BlackJack";
import IngameActionHandler from "../../blackjack/view-models/handlers/IngameActionHandler";
import ChineseBlackjackHandPlace from "./ChineseBlackjackHandPlace";
import ChineseBlackjackDealHandler from "./handlers/ChineseBlackjackDealHandler";
import ChineseBlackjackFinishHandler from "./handlers/ChineseBlackjackFinishHandler";
import ChineseBlackjackInGameHandler from "./handlers/ChineseBlackjackInGameHandler";
const { ccclass, property } = cc._decorator;

export const ChineseBlackjackId = 77;
export const CHINESE_BLACKJACK_EMIT_EVENTS = {
    STAND_CLICK: "CHINESE_BLACKJACK_STAND_CLICK",
    STAND_CLICK_NO: "CHINESE_BLACKJACK_STAND_CLICK_NO"
};

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

    @property(cc.Prefab)
    provablyFairPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guideProvablyFairPrefab: cc.Prefab = null;

    protected moveCardDuration = 0.35;
    chipJumpHeight = 250;
    betChips: BetChipsNew;
    provablyFair: ProvablyFair;

    constructor() {
        super();
        this.gameId = ChineseBlackjackId;
    }

    onLoad() {
        uiManager.emitterListener(CHINESE_BLACKJACK_EMIT_EVENTS.STAND_CLICK_NO, () => this.onPopupConfirmWithoutStand(), this);
        this.initProvablyFair();
        super.onLoad();
    }

    initProvablyFair() {
        this.provablyFair.callBackOpenGuide = () => {
            this.opeGuideProvablyFair();
        };
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
        uiManager.emitter.emit(CHINESE_BLACKJACK_EMIT_EVENTS.STAND_CLICK, true);
        this.standButton?.getComponent(FadeEffectButton).setDisabled(true);
    }

    onPopupConfirmWithoutStand() {
        this.standButton?.getComponent(FadeEffectButton).setDisabled(false);
    }

    openProvablyFair() {
        const dialog = cc.instantiate(this.provablyFairPrefab);
        this.currentMiniPanel.addDialog(dialog);
    }

    opeGuideProvablyFair() {
        const dialog = cc.instantiate(this.guideProvablyFairPrefab);
        const locale = getLocale();
        const language = getLanguage(locale);
        const guide = dialog.getComponent(WebViewGuide);
        guide.setURL(`/${language}/?gameId=${this.gameId}&PF=1&t=blue&c=0&f=sc&v=${Date.now()}`);
        this.currentMiniPanel.addDialog(dialog);
        guide.loadWebView();
    }
}
