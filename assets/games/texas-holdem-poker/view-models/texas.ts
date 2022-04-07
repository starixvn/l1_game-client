import * as i18n from "i18n/runtime-scripts/LanguageData";

import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import AudioManager from "../../../common/audio/AudioManager";
import NewButton from "../../../common/custom-button/NewButton";
import ExpandableMenu from "../../../common/expandable-menu/view-models/ExpandableMenu";
import PrefabLoader from "../../../common/PrefabLoader";
import TutorialMain from "../../../common/tutorial/TutorialMain";
import { GameIds } from "../../../configs/SabaConfigs";
import BetItem from "../../_base/view-models/BetItem";
import RoomPlayer from "../../_base/view-models/RoomPlayer";
import { CommonEvents } from "../../_new/_base/game-data-management/models/common-events";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { BettingAreaEvents } from "../../_new/common/betting-area/BettingArea";
import { events } from "../../_new/connection/SocketIOConnection";
import { updateMD5 } from "../../holdem-poker/actions/HoldemPokerMD5Action";
import { handleUM } from "../../holdem-poker/actions/HoldemPokerUmAction";
import { collectCards } from "../../holdem-poker/components/cards/view-models/CardWrapper";
import { HoldemPokerMD5Model } from "../../holdem-poker/event-models/HoldemPokerMD5Model";
import TexasMicroUIAction from "../actions/texas-microUI-action";
import { updateStatusGame } from "../actions/texas-notice-actions";
import {
    clearAllBetChips,
    clearBetChips,
    showHideButtons,
    showHideTooltip,
    showPlaceBetChips,
    updateAllChips,
    updateChips
} from "../actions/texas-place-bet-actions";
import { updatePreviousChoices } from "../actions/texas-rejoin-room-actions";
import { showWinningOption } from "../actions/texas-settlement-actions";
import {
    dealFirstThreeCommunityCards,
    dealFourAndFireCardAndFaceUpDealerCards,
    dealPlayerAndDealerCards,
    dealSecondCard,
    dealThirdCardAndFaceUpDealerCards,
    rawCardWhenRejoin,
    swapPlayerAndDealerCards
} from "../cards-component/view-models/cards-wrapper";
import HandleActionSwap from "../cards-component/view-models/handle-action-swap";
import TexasCards from "../cards-component/view-models/texas-cards";
import TexasUmHandler from "../event-handlers/texas-um-handler";
import TexasCallModel from "../event-models/texas-call-model";
import TexasConfigsModel from "../event-models/texas-configs-model";
import TexasDealModel from "../event-models/texas-deal-model";
import TexasFinishModel from "../event-models/texas-finish-model";
import TexasGameDataModel from "../event-models/texas-game-data-model";
import TexasHoldModel from "../event-models/texas-hold-model";
import TexasOwnBetModel from "../event-models/texas-own-bet-model";
import TexasPlaceBetModel from "../event-models/texas-place-bet-model";
import TexasSettlementModel from "../event-models/texas-settlement-model";
import TexasSwapModel from "../event-models/texas-swap-model";
import TexasTicketDetailModel from "../event-models/texas-ticket-detail-model";
import TexasTurnModel from "../event-models/texas-turn-model";
import { BetAction, disableButtonText, TexasChoicesConst, TimerShowInteractiveGuide } from "../texas-constants";
import { TexasChoicesType } from "../texas-type";
import { updateLeftRightOddsTable, updateMinMax } from "./../actions/texas-configs-actions";
import { handleMD5 } from "./../actions/texas-md5-action";
import { prepareNewRound, showOwnBet } from "./../actions/texas-place-bet-actions";
import { showRejoinOwnBets } from "./../actions/texas-rejoin-room-actions";
import { renderTicketDetail } from "./../actions/texas-ticket-detail-actions";
import { dealPlayerAndDealerCardsWithoutSwap, holdPlayerAndDealerCards } from "./../cards-component/view-models/cards-wrapper";
import TexasRiverModel from "./../event-models/texas-river-model";
import TexasStateModel from "./../event-models/texas-state-model";
import TexasTicketHistory from "./game-history/texas-ticket-history";
import TexasBettingArea from "./texas-betting-area";
import TexasChips from "./texas-chips";
import TexasMD5 from "./texas-MD5";
import TexasMinMax from "./texas-min-max";
import TexasOddsTable from "./texas-odds-table";
import TexasPlacingBet from "./texas-placing-bet";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Texas extends NewGameRoomBase {
    @property({ visible: false, override: true })
    betItems: BetItem[] = [];

    @property({ visible: false, override: true })
    players: RoomPlayer[] = [];

    @property({ visible: false, override: true })
    timeWaitNode: cc.Node = null;

    @property({ visible: false, override: true })
    timeWaitLabel: cc.Label = null;

    @property({ visible: false, override: true })
    animatedTime: AnimatedTime = null;

    @property({ visible: false, override: true })
    otherPlayers: cc.Node = null;

    @property({ visible: false, override: true })
    gameAudiosPrefab: cc.Prefab = null;

    @property({ type: [PrefabLoader] })
    protected prefabLoader: PrefabLoader[] = [];

    @property({ type: [cc.Component] })
    protected bettingAreas: TexasBettingArea[] = [];

    @property({ type: [TexasMicroUIAction] })
    protected microUIAction: TexasMicroUIAction[] = [];

    @property(cc.Node)
    doubleButton: cc.Node = null;

    @property(cc.Node)
    reBetAndDealButton: cc.Node = null;

    @property(cc.Node)
    cancelButton: cc.Node = null;

    @property(cc.Node)
    dealButton: cc.Node = null;

    @property(cc.Node)
    callButton: cc.Node = null;

    @property(cc.Node)
    riverButton: cc.Node = null;

    @property(cc.Node)
    checkRiverButton: cc.Node = null;

    @property(cc.Node)
    turnButton: cc.Node = null;

    @property(cc.Node)
    checkTurnButton: cc.Node = null;

    @property(cc.Node)
    foldButton: cc.Node = null;

    @property(cc.Node)
    newButton: cc.Node = null;

    @property(cc.Node)
    swapButton: cc.Node = null;

    @property(cc.Node)
    holdButton: cc.Node = null;

    @property(cc.SpriteFrame)
    shadowChip: cc.SpriteFrame = null;

    @property({ type: TexasMinMax })
    protected minMaxTable: TexasMinMax = null;

    @property({ type: [TexasOddsTable] })
    protected oddsTables: TexasOddsTable[] = [];

    @property(cc.Node)
    dealerChipTray: cc.Node = null;

    @property(cc.Node)
    texasSwapCards: cc.Node = null;

    @property(cc.Label)
    totalBetLabel: cc.Label = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(TexasMD5)
    md5Comp: TexasMD5 = null;

    @property(cc.AudioSource)
    gameNotificationsAudio: cc.AudioSource = null;

    @property(cc.AudioSource)
    singleChipAudio: cc.AudioSource = null;

    @property(cc.AudioSource)
    startNewRoundAudio: cc.AudioSource = null;

    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    @property(HandleActionSwap)
    swapMenu: HandleActionSwap = null;

    @property(cc.Prefab)
    interactiveGuidePrefab: cc.Prefab = null;

    @property(cc.Label)
    totalBetValue: cc.Label = null;

    @property(cc.Node)
    cardTray: cc.Node = null;

    @property(cc.Node)
    cardBox: cc.Node = null;

    @property(cc.Node)
    interactiveGuide: cc.Node = null;

    protected placingBet: TexasPlacingBet = null;
    protected gameData: TexasGameDataModel<TexasChoicesType> = null;
    protected texasChips: TexasChips;
    protected pokerCardScript: TexasCards = undefined;
    protected betHistoryController: TexasTicketHistory = null;
    protected isSwapCard = true;
    private statusShowSwapIcon = false;

    constructor() {
        super();
        this.gameId = GameIds.TexasHoldemPoker;
    }

    onLoad() {
        this.gameData = new TexasGameDataModel<TexasChoicesType>();
        this.texasChips = new TexasChips();
        this.microUIAction.forEach((e) => e.connectGameData(this.gameData));

        super.onLoad();
    }

    start() {
        super.start();

        this.initPlacingBet();
        this.initButtonStatus();
        this.registerStateEvents();
        this.registerConfigsEvents();
        this.initPokerCardScript();
        this.registerBettingAreasEvents();
        this.registerPlaceBetEvents();
        this.registerAfterDealEvents();
        this.registerAfterSwapEvents();
        this.registerAfterHoldEvents();
        this.registerAfterCallEvents();
        this.registerAfterTurnEvents();
        this.registerAfterRiverEvents();
        this.registerBetEvents();
        this.registerSettlementEvents();
        this.registerTicketDetailEvents();
        this.registerNoticeEvents();
        this.registerMD5Event();
    }

    initInteractiveGuide() {
        const storageKey = "texas_interactive_guide";
        const storage = cc.sys.localStorage.getItem(storageKey);
        const data = storage
            ? JSON.parse(storage)
            : {
                  enabled: true
              };

        if (!data.enabled || !this.interactiveGuidePrefab) {
            return;
        }
        this.handleStatusNodeMain(false);
        const node = cc.instantiate(this.interactiveGuidePrefab);
        this.interactiveGuide.addChild(node);
        const tutorialMain = node.getComponent(TutorialMain);
        tutorialMain.setTimeConfig(TimerShowInteractiveGuide);
        tutorialMain.toggleCallback = (dontShow: boolean) => {
            data.enabled = !dontShow;
            cc.sys.localStorage.setItem(storageKey, JSON.stringify(data));
        };

        tutorialMain.endSlideCallBack = () => {
            this.handleStatusNodeMain(true);
        };
        tutorialMain.show();
    }

    initPokerCardScript() {
        this.pokerCardScript = this.node.getChildByName("poker-cards-script").getComponent(TexasCards);
    }

    onGameHide() {
        // onGameHide
    }

    handleStatusNodeMain(status: boolean) {
        if (status) {
            this.totalBetValue.string = "0";
            this.cardBox.opacity = 255;
            this.cardTray.opacity = 255;
            this.bettingAreas.forEach((bet) => {
                bet.node.opacity = 255;
            });
        } else {
            this.totalBetValue.string = "";
            this.cardBox.opacity = 150;
            this.cardTray.opacity = 150;
            this.bettingAreas.forEach((bet) => {
                bet.node.opacity = 25;
            });
        }

        this.bettingAreas[0].showTooltip(status);
        this.bettingAreas[0].showBetText(status);
    }

    initHandlers() {
        super.initHandlers();

        this.umHandler = new TexasUmHandler(this);
    }

    private registerConfigsEvents() {
        this.gameData.configs.on(TexasConfigsModel.Events.CHANGE, (configs: TexasConfigsModel) => {
            this.setGameConfigs(configs);
            updateMinMax(this.minMaxTable)(this);
            updateLeftRightOddsTable(this.oddsTables[0])(configs);
            updateLeftRightOddsTable(this.oddsTables[1])(configs);
        });
    }

    protected addHandlers(): void {
        super.addHandlers(this.umHandler, this.noticeHandler, this.errorHandler, this.betHandler);
    }

    onDataGameRoom(data: any) {
        super.onDataGameRoom(data);
        if (this.gameData) {
            this.gameData.receiveData(data);
        }
    }

    public disabledButtons(status: boolean) {
        this.dealButton.getChildByName(disableButtonText).active = status;
        this.cancelButton.getChildByName(disableButtonText).active = status;
        this.doubleButton.getChildByName(disableButtonText).active = status;
        this.callButton.getChildByName(disableButtonText).active = status;
        this.turnButton.getChildByName(disableButtonText).active = status;
        this.checkTurnButton.getChildByName(disableButtonText).active = status;
        this.riverButton.getChildByName(disableButtonText).active = status;
        this.checkRiverButton.getChildByName(disableButtonText).active = status;
        this.reBetAndDealButton.getChildByName(disableButtonText).active = status;
        this.newButton.getChildByName(disableButtonText).active = status;
        this.foldButton.getChildByName(disableButtonText).active = status;
        this.swapButton.getChildByName(disableButtonText).active = status;
        this.holdButton.getChildByName(disableButtonText).active = status;
    }

    private initButtonStatus() {
        this.dealButton.getComponent(NewButton).callback.selected = () =>
            !this.dealButton.getChildByName(disableButtonText).active && this.onDealClick();

        this.cancelButton.getComponent(NewButton).callback.selected = () =>
            !this.cancelButton.getChildByName(disableButtonText).active && this.onClearClick();

        this.doubleButton.getComponent(NewButton).callback.selected = () =>
            !this.doubleButton.getChildByName(disableButtonText).active && this.onDoubleClick();

        this.callButton.getComponent(NewButton).callback.selected = () =>
            !this.callButton.getChildByName(disableButtonText).active && this.onDoubleAndCallClick();

        this.turnButton.getComponent(NewButton).callback.selected = () =>
            !this.turnButton.getChildByName(disableButtonText).active && this.onTurnClick();

        this.checkTurnButton.getComponent(NewButton).callback.selected = () =>
            !this.checkTurnButton.getChildByName(disableButtonText).active && this.onCheckTurnClick();

        this.riverButton.getComponent(NewButton).callback.selected = () =>
            !this.riverButton.getChildByName(disableButtonText).active && this.onRiverClick();

        this.checkRiverButton.getComponent(NewButton).callback.selected = () =>
            !this.checkRiverButton.getChildByName(disableButtonText).active && this.onCheckRiverClick();

        this.reBetAndDealButton.getComponent(NewButton).callback.selected = () =>
            !this.reBetAndDealButton.getChildByName(disableButtonText).active && this.onRebetAndDeal();

        this.newButton.getComponent(NewButton).callback.selected = () =>
            !this.newButton.getChildByName(disableButtonText).active && this.onNewButtonClick();

        this.foldButton.getComponent(NewButton).callback.selected = () =>
            !this.foldButton.getChildByName(disableButtonText).active && this.onFoldClick();

        this.swapButton.getComponent(NewButton).callback.selected = () =>
            !this.swapButton.getChildByName(disableButtonText).active && this.onSwapClick();

        this.holdButton.getComponent(NewButton).callback.selected = () =>
            !this.holdButton.getChildByName(disableButtonText).active && this.onHoldClick();
    }

    private initTicketHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.betHistoryController = dialog.getComponent(TexasTicketHistory);
        this.betHistoryController.init(this as any);
        this.betHistoryController.setConnection(this.connection, this.gameName, this.gameData.roundCounter.roundId);
        this.betHistoryController.node.active = false;
        this.currentMiniPanel.addDialog(dialog);
    }

    pressedShowHistory() {
        this.playClick();
        this.expandableMenu.collapseMenu();
        this.initTicketHistory();
        this.betHistoryController.setId(this.gameData.roundCounter.roundId);
        this.betHistoryController.showDialog();
    }

    openGuide() {
        super.openGuide();
        this.expandableMenu.collapseMenu();
    }

    private initPlacingBet() {
        this.placingBet = new TexasPlacingBet(this.gameData, this, () => this.connection);
    }

    private registerBettingAreasEvents() {
        this.bettingAreas.forEach((area) => {
            area.node.on(BettingAreaEvents.PLACING_BET, this.onPlacingBet, this);
        });
    }

    private onPlacingBet(betChoice: string) {
        if (betChoice === TexasChoicesConst.anteBet) {
            this.dealButton.getChildByName(disableButtonText).active = false;
            this.doubleButton.getChildByName(disableButtonText).active = false;
            this.cancelButton.getChildByName(disableButtonText).active = false;
        }
        this.placingBet.placeBet(betChoice, this.currentBet);
    }

    private registerPlaceBetEvents() {
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.PLACE_BET_CHIPS, ({ currentChoice, currentAmount, totalAmount }) => {
            showPlaceBetChips(
                this.bettingAreas,
                this.betChips,
                this.shadowChip,
                this.texasChips,
                currentChoice,
                currentAmount,
                totalAmount
            );
        });

        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.CLEAR_BET_CHIPS, clearBetChips(this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.CLEAR_ALL_BET_CHIPS, clearAllBetChips(this.bettingAreas));
        this.gameData.placeBetModel.on(
            TexasPlaceBetModel.Events.UPDATE_ALL_CHIPS,
            updateAllChips(this.bettingAreas, this.betChips, this.shadowChip, this.texasChips)
        );
        this.gameData.placeBetModel.on(
            TexasPlaceBetModel.Events.UPDATE_CHIPS,
            updateChips(this.bettingAreas, this.betChips, this.shadowChip, this.texasChips)
        );

        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.PLACE_BET, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.DOUBLE, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.CALL, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.TURN, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.RIVER, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.UPDATE_GAME_ROUND, () => {
            this.gameRound.string = "";
        });
    }

    private registerSettlementEvents() {
        this.gameData.on(TexasGameDataModel.Events.SETTLED, () => {
            this.gameData.stateModel.settle();
            this.handleDisableSwap(false);
        });

        this.gameData.finishModel.on(TexasFinishModel.Events.CHANGE_SETTLEMENT, () => {
            this.gameData?.settlement.startSettlement();
        });

        this.gameData?.settlement.on(
            TexasSettlementModel.Events.START_SETTLEMENT,
            showWinningOption(this.bettingAreas, this.texasChips, this.betChips, this.gameData, this)
        );

        this.gameData?.settlement.on(TexasSettlementModel.Events.START_SHOW_CARDS, () => {
            dealThirdCardAndFaceUpDealerCards(
                this.pokerCardScript,
                this.gameData.riverModel,
                () => {
                    this.gameData?.settlement.finishShowCards();
                },
                () => {
                    this.md5Comp.createResultDetails(this.gameData.md5Model.md5);
                }
            );
        });

        this.gameData?.settlement.on(TexasSettlementModel.Events.START_AUTO_CHECK, () => {
            this.turnButton.active = this.checkTurnButton.active = this.riverButton.active = this.checkRiverButton.active = false;
            this.reBetAndDealButton.active = this.newButton.active = false;
            this.holdButton.active = this.swapButton.active = false;
            dealFourAndFireCardAndFaceUpDealerCards(this.pokerCardScript, this.gameData.autoSettleModel, () => {
                this.gameData?.settlement.finishShowCards();
            });
        });

        this.gameData?.finishModel.on(TexasFinishModel.Events.SHOWED_ANIMATION, () => {
            this.gameData?.stateModel.riveSuccess();
            this.gameData.settlement.autoSettle = false;
        });
    }

    public getConfigs() {
        this.connection.emit(events.getGameConfigs);
    }

    private registerStateEvents() {
        this.gameData.stateModel.on(TexasStateModel.Events.CHANGE, showHideButtons(this));
        this.gameData.stateModel.on(TexasStateModel.Events.CHANGE, showHideTooltip(this.bettingAreas));
        this.gameData.stateModel.on(TexasStateModel.Events.PREPARE_NEW_ROUND, prepareNewRound(this.gameData.placeBetModel));
        this.gameData.stateModel.on(TexasStateModel.Events.FORCE_UPDATE_BALANCE, () => this.updateUserBalance());
        this.gameData.stateModel.on(TexasStateModel.Events.CHANGE, handleMD5(this));
    }

    private registerAfterDealEvents() {
        this.gameData.dealModel.on(TexasDealModel.Events.CHANGE, () => {
            this.isSwapCard
                ? dealPlayerAndDealerCards(this.pokerCardScript, () => this.gameData.stateModel.afterDeal())
                : this.afterDealWithoutSwap();
        });
    }

    private afterDealWithoutSwap() {
        this.gameData.stateModel.afterDeal();
        this.placingBet.handleClickOnChoice(TexasChoicesConst.hold);
    }

    private registerAfterSwapEvents() {
        this.gameData.swapModel.on(TexasSwapModel.Events.CHANGE, (swapModel: TexasSwapModel) => {
            swapPlayerAndDealerCards(this.pokerCardScript, swapModel, this.texasSwapCards, () => this.gameData.stateModel.swapSuccess());
        });
    }

    private registerAfterHoldEvents() {
        this.gameData.holdModel.on(TexasHoldModel.Events.CHANGE, (holdModel: TexasHoldModel) => {
            this.isSwapCard
                ? holdPlayerAndDealerCards(this.pokerCardScript, holdModel, () => this.gameData.stateModel.holdSuccess())
                : dealPlayerAndDealerCardsWithoutSwap(this.pokerCardScript, holdModel, () => this.gameData.stateModel.holdSuccess());
        });
    }

    private registerAfterCallEvents() {
        this.gameData.callModel.on(TexasCallModel.Events.CHANGE, (callModel: TexasCallModel) => {
            dealFirstThreeCommunityCards(this.pokerCardScript, callModel, () => this.gameData.stateModel.callSuccess());
        });
    }
    private registerAfterTurnEvents() {
        this.gameData.turnModel.on(TexasTurnModel.Events.CHANGE, (turnModel: TexasTurnModel) => {
            dealSecondCard(this.pokerCardScript, turnModel, () => this.gameData.stateModel.turnSuccess());
        });
    }

    private registerAfterRiverEvents() {
        this.gameData.riverModel.on(TexasRiverModel.Events.CHANGE, () => {
            this.gameData.settlement.waiting = true;
        });
    }

    private registerBetEvents() {
        this.gameData.on(TexasGameDataModel.Events.CHOICES_RESULT, updatePreviousChoices(this.gameData.placeBetModel));
        this.gameData.on(TexasGameDataModel.Events.SHOW_PROCESSING_BET, () => this.showProcessingWarning(true));
        this.gameData.on(TexasGameDataModel.Events.HIDE_PROCESSING_BET, () => this.showProcessingWarning(false));

        this.gameData.ownBets.on(TexasOwnBetModel.Events.EMPTY, () => {
            this.initInteractiveGuide();
        });
        this.gameData.ownBets.on(TexasOwnBetModel.Events.OWN_BETS, showRejoinOwnBets(this.gameData));
        this.gameData.ownBets.on(TexasOwnBetModel.Events.OWN_BETS, (ownBets: TexasOwnBetModel) => {
            rawCardWhenRejoin(this.pokerCardScript, ownBets);
            this.handleDisableSwap(true);
        });
    }

    private registerTicketDetailEvents() {
        this.gameData.ticketDetailModel.on(TexasTicketDetailModel.Events.CHANGE, (data) => {
            renderTicketDetail(this.betHistoryController)(data);
        });
    }

    private registerNoticeEvents() {
        this.gameData.on(CommonEvents.API_ERROR, updateStatusGame(this.gameData));
        this.gameData.on(CommonEvents.NOTICE, () => this.disabledButtons(false));
        this.gameData.on(CommonEvents.UM, handleUM(this));
    }

    private registerMD5Event() {
        this.gameData.md5Model.on(HoldemPokerMD5Model.Events.CHANGE, (md5: HoldemPokerMD5Model) => {
            updateMD5(this.md5Comp)(md5);
        });
    }

    onDealClick() {
        this.playClick();
        this.handleDisableSwap(true);
        this.placingBet.handleClickDeal();
    }

    onDoubleClick() {
        this.playClick();
        this.placingBet.doubleBet(TexasChoicesConst.anteBet, this.gameData.placeBetModel.choices[TexasChoicesConst.anteBet]);
    }

    onClearClick() {
        this.playClick();
        this.handleDisableSwap(false);
        this.placingBet.clear();
    }

    onDoubleAndCallClick() {
        this.playClick();
        this.placingBet.handleClickButton(
            TexasChoicesConst.callBet,
            this.gameData.placeBetModel.choices[TexasChoicesConst.anteBet] * 2,
            BetAction.doubleCall
        );
    }

    onTurnClick() {
        this.playClick();
        this.placingBet.handleClickButton(
            TexasChoicesConst.turnBet,
            this.gameData.placeBetModel.choices[TexasChoicesConst.anteBet],
            BetAction.betTurn
        );
    }

    onCheckTurnClick() {
        this.playClick();
        this.placingBet.handleClickButtonNoneBet(TexasChoicesConst.checkTurn);
    }

    onRiverClick() {
        this.playClick();
        this.placingBet.handleClickButton(
            TexasChoicesConst.riverBet,
            this.gameData.placeBetModel.choices[TexasChoicesConst.anteBet],
            BetAction.betRiver
        );
    }

    onCheckRiverClick() {
        this.playClick();
        this.placingBet.handleClickButtonNoneBet(TexasChoicesConst.checkRiver);
    }

    onRebetAndDeal() {
        this.playClick();
        this.handleDisableSwap(true);
        this.hideButtonPrepareNewRound();
        collectCards(this.pokerCardScript, () => this.placingBet && this.placingBet.rebetAndDeal());
        clearAllBetChips(this.bettingAreas)();
        this.texasChips.stopWinningEffect();
        this.clearWinningBet();
    }

    onNewButtonClick() {
        this.playClick();
        this.hideButtonPrepareNewRound();
        collectCards(
            this.pokerCardScript,
            () =>
                this.gameData &&
                this.gameData.receiveUIData({
                    new: {}
                })
        );
        clearAllBetChips(this.bettingAreas)();
        this.texasChips.stopWinningEffect();
        this.clearWinningBet();
    }

    onFoldClick() {
        this.playClick();
        this.placingBet.handleClickButtonNoneBet(TexasChoicesConst.fold);
    }

    onSwapClick() {
        this.playClick();
        this.placingBet.handleClickOnChoice(TexasChoicesConst.swap);
    }

    onHoldClick() {
        this.playClick();
        this.placingBet.handleClickOnChoice(TexasChoicesConst.hold);
    }

    private hideButtonPrepareNewRound() {
        this.reBetAndDealButton.active = this.newButton.active = false;
    }

    playStartGameAudio() {
        AudioManager.getInstance().playSFX(this.startNewRoundAudio.clip);
    }

    sendRetryMessage(): void {
        this.connection.emit("retry");
    }

    set disableIconSwap(value: boolean) {
        this.statusShowSwapIcon = value;
    }

    onIconSwapClick() {
        if (!this.statusShowSwapIcon) {
            this.isSwapCard = !this.isSwapCard;
            this.swapMenu.setSwapStatus(!this.isSwapCard);
            this.isSwapCard
                ? this.showMiniWarning(i18n.t("texasPoker.swapCardOn"))
                : this.showMiniWarning(i18n.t("texasPoker.swapCardOff"));
        }
    }

    private handleDisableSwap(isDisable: boolean) {
        this.disableIconSwap = isDisable;
        isDisable ? this.swapMenu.setDisable() : this.swapMenu.setEnable();
    }
}
