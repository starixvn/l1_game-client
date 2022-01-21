import AudioManager from "../../../common/audio/AudioManager";
import { getLanguage, getLocale } from "../../../common/auth/SessionManager";
import NewButton from "../../../common/custom-button/NewButton";
import GameRoomMenu from "../../../common/expandable-menu/view-models/GameRoomMenu";
import PrefabLoader from "../../../common/PrefabLoader";
import WebViewGuide from "../../../common/webview-guide/WebViewGuide";
import { GameIds } from "../../../configs/SabaConfigs";
import DataHandler from "../../_base/handlers/DataHandler";
import { CommonEvents } from "../../_new/_base/game-data-management/models/common-events";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { BettingAreaEvents } from "../../_new/common/betting-area/BettingArea";
import { events } from "../../_new/connection/SocketIOConnection";
import { updateAaOdds, updateAnteOdds, updateMinMax } from "../actions/HoldemPokerConfigActions";
import { handleMD5, updateMD5 } from "../actions/HoldemPokerMD5Action";
import { updateStatusGame } from "../actions/HoldemPokerNoticeActions";
import {
    clearAllBetChips,
    clearBetChips,
    prepareNewRound,
    showHideButtons,
    showHideClearIcon,
    showHideTooltip,
    showOwnBet,
    showPlaceBetChips,
    showSlidingChipWithProcessingFail,
    updateAllChips,
    updateChips,
    updateTotalBetLabel,
} from "../actions/HoldemPokerPlaceBetActions";
import { showRejoinOwnBets, showRejoinTotalBet, updatePreviousChoices } from "../actions/HoldemPokerRejoinRoomActions";
import { updateRoundCounter, updateRoundId } from "../actions/HoldemPokerRoundCounterActions";
import { showWinningOption } from "../actions/HoldemPokerSettlementActions";
import { renderTicketDetail } from "../actions/HoldemPokerTicketDetailActions";
import { handleUM } from "../actions/HoldemPokerUmAction";
import {
    collectCart,
    rawCardAfterClickCall,
    rawCardAfterClickDeal,
    rawCardWhenRejoin,
} from "../components/cards/view-models/CardWrapper";
import PokerCards from "../components/cards/view-models/HoldemPokerCards";
import HoldemPokerUmHandler from "../event-handlers/HoldemPokerUmHandler";
import { HoldemPockerMD5Model } from "../event-models/HoldemPockerMD5Model";
import { HoldemPokerAfterCallModel } from "../event-models/HoldemPokerAfterCallModel";
import { HoldemPokerAfterDealModel } from "../event-models/HoldemPokerAfterDealModel";
import HoldemPokerChoices, { HoldemPokerChoicesConst } from "../event-models/HoldemPokerChoices";
import { HoldemPokerConfigs } from "../event-models/HoldemPokerConfigs";
import { HoldemPokerFinishModel } from "../event-models/HoldemPokerFinishModel";
import { HoldemPokerGameData } from "../event-models/HoldemPokerGameData";
import { HoldemPokerOwnBet } from "../event-models/HoldemPokerOwnBet";
import { HoldemPokerPlaceBetModel } from "../event-models/HoldemPokerPlaceBetModel";
import { HoldemPokerRoundCounter } from "../event-models/HoldemPokerRoundCounter";
import { HoldemPokerSettlement } from "../event-models/HoldemPokerSettlement";
import { HoldemPokerStateModel } from "../event-models/HoldemPokerStateModel";
import { HoldemPokerTicketDetailModel } from "../event-models/HoldemPokerTicketDetailModel";
import HoldemPokerTicketHistory from "./history/HoldemPokerTicketHistory";
import HoldemPockerMD5 from "./HoldemPockerMD5";
import HoldemPokerAaOddsTable from "./HoldemPokerAaOddsTable";
import HoldemPokerAnteOddsTable from "./HoldemPokerAnteOddsTable";
import HoldemPokerBettingArea from "./HoldemPokerBettingArea";
import HoldemPokerChips from "./HoldemPokerChips";
import HoldemPokerMinMaxTable from "./HoldemPokerMinMaxTable";
import HoldemPokerPlacingBet from "./HoldemPokerPlacingBet";

const { ccclass, property } = cc._decorator;
@ccclass
export default class HoldemPoker extends NewGameRoomBase {
    @property({ type: [PrefabLoader] })
    protected prefabLoader: PrefabLoader[] = [];

    @property(cc.Node)
    gameMenuContainer: cc.Node = null;

    @property({ type: [cc.Component] })
    protected bettingAreas: HoldemPokerBettingArea[] = [];

    @property(cc.Node)
    doubleButton: cc.Node = null;

    @property(cc.Node)
    reBetAndDealButton: cc.Node = null;

    @property(cc.Node)
    cancelButton: cc.Node = null;

    @property(cc.Node)
    dealButton: cc.Node = null;

    @property(cc.Node)
    doubleAndCallButton: cc.Node = null;

    @property(cc.Node)
    foldButton: cc.Node = null;

    @property(cc.Node)
    newButton: cc.Node = null;

    @property(cc.SpriteFrame)
    shadowChip: cc.SpriteFrame = null;

    @property({ type: HoldemPokerMinMaxTable })
    protected minMaxTable: HoldemPokerMinMaxTable = null;

    @property({ type: HoldemPokerAnteOddsTable })
    protected anteOddsTable: HoldemPokerAnteOddsTable = null;

    @property({ type: HoldemPokerAaOddsTable })
    protected aaOddsTable: HoldemPokerAaOddsTable = null;

    @property(cc.Node)
    dealerChipTray: cc.Node = null;

    @property(cc.Label)
    totalBetLabel: cc.Label = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(HoldemPockerMD5)
    md5Comp: HoldemPockerMD5 = null;

    @property(cc.AudioSource)
    gameNotificationsAudio: cc.AudioSource = null;

    @property(cc.AudioSource)
    singleChipAudio: cc.AudioSource = null;

    @property(cc.AudioSource)
    startNewRoundAudio: cc.AudioSource = null;

    protected colorItem = "#4d2a0e";
    protected colorIconMain = "#4d2a0e";
    private placingBet: HoldemPokerPlacingBet = null;
    private holdemPokerChips: HoldemPokerChips;
    private gameData: HoldemPokerGameData<HoldemPokerChoices> = null;
    pokerCardScript: PokerCards = undefined;
    private betHistoryController: HoldemPokerTicketHistory = null;

    constructor() {
        super();
        this.gameId = GameIds.CasinoHoldemPoker;
    }

    onLoad() {
        this.gameData = new HoldemPokerGameData<HoldemPokerChoices>();
        this.holdemPokerChips = new HoldemPokerChips();
        super.onLoad();
    }

    start() {
        super.start();

        this.initMenu();
        this.initPlacingBet();
        this.initBettingAreas();
        this.initButtonStatus();

        this.prefabLoader.forEach((loader) => loader.initialize());

        this.registerBettingAreasEvents();
        this.registerPlaceBetEvents();
        this.registerConfigsEvents();
        this.registerStateEvents();
        this.registerAfterCallEvents();
        this.registerAfterDealEvents();
        this.registerBetEvents();
        this.registerSettlementEvents();
        this.initPokerCardScript();
        this.registerRoundCounterEvents();
        this.registerNoticeEvents();
        this.registerTicketDetailEvents();
        this.registerMD5Event();
    }

    initPokerCardScript() {
        this.pokerCardScript = this.node.getChildByName("PokerCardScript").getComponent(PokerCards);
    }

    onGameHide() {}

    initHandlers() {
        super.initHandlers();

        this.umHandler = new HoldemPokerUmHandler(this);
    }

    protected addHandlers(...handlers: DataHandler[]): void {
        super.addHandlers(this.umHandler, this.noticeHandler, this.errorHandler, this.betHandler);
    }

    onDataGameRoom(data: any) {
        super.onDataGameRoom(data);
        if (this.gameData) {
            this.gameData.receiveData(data);
        }
    }

    private initMenu() {
        const gameRoomMenu = this.gameMenuContainer.getComponent(GameRoomMenu);
        const menuAction = [this.onCloseGameClick, this.pressedShowHistory, this.openGuide];
        gameRoomMenu.initialize(this.node, this).addCommonIcon().withEvents(menuAction);
    }

    private pressedShowHistory() {
        this.playClick();
        const gameRomeMenuControl = this.gameMenuContainer.getComponent(GameRoomMenu);
        gameRomeMenuControl.collapseMenu();
        this.initTicketHistory();
        this.betHistoryController.setId(this.gameData.roundCounter.roundId);
        this.betHistoryController.showDialog();
    }

    openGuide() {
        super.openGuide();
        const gameRomeMenuControl = this.gameMenuContainer.getComponent(GameRoomMenu);
        gameRomeMenuControl.collapseMenu();
    }

    private initPlacingBet() {
        this.placingBet = new HoldemPokerPlacingBet(this.gameData, this.bettingAreas, this, () => this.connection);
    }

    private initBettingAreas() {
        this.bettingAreas.forEach((area) => {
            area.init(this.gameData);
        });
    }

    public disabledButtons(status: boolean) {
        const disableButton = "btn-disable";
        this.dealButton.getChildByName(disableButton).active = status;
        this.cancelButton.getChildByName(disableButton).active = status;
        this.doubleButton.getChildByName(disableButton).active = status;
        this.reBetAndDealButton.getChildByName(disableButton).active = status;
        this.foldButton.getChildByName(disableButton).active = status;
        this.doubleAndCallButton.getChildByName(disableButton).active = status;
        this.newButton.getChildByName(disableButton).active = status;
    }

    private initButtonStatus() {
        const disableButton = "btn-disable";
        this.dealButton.getComponent(NewButton).callback.selected = () =>
            !this.dealButton.getChildByName(disableButton).active && this.onDealClick();
        this.doubleButton.getComponent(NewButton).callback.selected = () =>
            !this.doubleButton.getChildByName(disableButton).active && this.onDoubleClick();
        this.cancelButton.getComponent(NewButton).callback.selected = () =>
            !this.cancelButton.getChildByName(disableButton).active && this.onCancelClick();
        this.reBetAndDealButton.getComponent(NewButton).callback.selected = () =>
            !this.reBetAndDealButton.getChildByName(disableButton).active && this.onRebetAndDeal();
        this.foldButton.getComponent(NewButton).callback.selected = () =>
            !this.foldButton.getChildByName(disableButton).active && this.onFoldClick();
        this.doubleAndCallButton.getComponent(NewButton).callback.selected = () =>
            !this.doubleAndCallButton.getChildByName(disableButton).active && this.onDoubleAndCallClick();
        this.newButton.getComponent(NewButton).callback.selected = () =>
            !this.newButton.getChildByName(disableButton).active && this.onNewButtonClick();
    }

    private initTicketHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.betHistoryController = dialog.getComponent(HoldemPokerTicketHistory);
        this.betHistoryController.init(this);
        this.betHistoryController.setConnection(this.connection, this.gameName, this.gameData.roundCounter.roundId);
        this.betHistoryController.node.active = false;
        this.currentMiniPanel.addDialog(dialog);
    }

    private registerBettingAreasEvents() {
        this.bettingAreas.forEach((area) => {
            area.node.on(BettingAreaEvents.PLACING_BET, this.onPlacingBet, this);
        });
    }

    private onPlacingBet(betChoice: string) {
        this.placingBet.placeBet(betChoice, this.currentBet);
    }

    private registerPlaceBetEvents() {
        this.gameData.placeBetModel.on(HoldemPokerPlaceBetModel.Events.PLACE_BET, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(HoldemPokerPlaceBetModel.Events.PLACE_BET, updateTotalBetLabel(this.totalBetLabel));
        this.gameData.placeBetModel.on(HoldemPokerPlaceBetModel.Events.UPDATE_GAME_ROUND, () => {
            this.gameRound.string = "";
        });

        this.gameData.placeBetModel.on(HoldemPokerPlaceBetModel.Events.DOUBLE, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(HoldemPokerPlaceBetModel.Events.DOUBLE, updateTotalBetLabel(this.totalBetLabel));

        this.gameData.placeBetModel.on(HoldemPokerPlaceBetModel.Events.CALL, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(HoldemPokerPlaceBetModel.Events.CALL, updateTotalBetLabel(this.totalBetLabel));

        this.gameData.placeBetModel.on(HoldemPokerPlaceBetModel.Events.CLEAR_BETS, updateTotalBetLabel(this.totalBetLabel));

        this.gameData.placeBetModel.on(
            HoldemPokerPlaceBetModel.Events.PLACE_BET_CHIPS,
            showPlaceBetChips(this.bettingAreas, this.betChips, this.shadowChip, this.holdemPokerChips, this.gameData, this)
        );
        this.gameData.placeBetModel.on(HoldemPokerPlaceBetModel.Events.CLEAR_BET_CHIPS, clearBetChips(this.bettingAreas));
        this.gameData.placeBetModel.on(HoldemPokerPlaceBetModel.Events.CLEAR_ALL_BET_CHIPS, clearAllBetChips(this.bettingAreas));
        this.gameData.placeBetModel.on(
            HoldemPokerPlaceBetModel.Events.UPDATE_ALL_CHIPS,
            updateAllChips(this.bettingAreas, this.betChips, this.shadowChip, this.holdemPokerChips)
        );
        this.gameData.placeBetModel.on(
            HoldemPokerPlaceBetModel.Events.UPDATE_CHIPS,
            updateChips(this.bettingAreas, this.betChips, this.shadowChip, this.holdemPokerChips)
        );
    }

    private registerConfigsEvents() {
        this.gameData.configs.on(HoldemPokerConfigs.Events.CHANGE, (configs: HoldemPokerConfigs) => {
            this.setGameConfigs(configs);
            updateMinMax(this.minMaxTable)(this);
            updateAnteOdds(this.anteOddsTable)(configs);
            updateAaOdds(this.aaOddsTable)(configs);
        });
    }

    private registerMD5Event() {
        this.gameData.md5Model.on(HoldemPockerMD5Model.Events.CHANGE, (md5: HoldemPockerMD5Model) => {
            updateMD5(this.md5Comp)(md5);
        });
    }

    private registerStateEvents() {
        this.gameData.stateModel.on(HoldemPokerStateModel.Events.CHANGE, showHideButtons(this));
        this.gameData.stateModel.on(HoldemPokerStateModel.Events.CHANGE, showHideTooltip(this.bettingAreas));
        this.gameData.stateModel.on(HoldemPokerStateModel.Events.CHANGE, showHideClearIcon(this.bettingAreas));
        this.gameData.stateModel.on(HoldemPokerStateModel.Events.PREPARE_NEW_ROUND, prepareNewRound(this.gameData.placeBetModel));
        this.gameData.stateModel.on(HoldemPokerStateModel.Events.CHANGE, handleMD5(this));
    }

    private registerAfterCallEvents() {
        this.gameData.callModel.on(HoldemPokerAfterCallModel.Events.CHANGE, () => {
            this.gameData.settlement.waiting = true;
        });
    }

    private registerAfterDealEvents() {
        this.gameData.dealModel.on(HoldemPokerAfterDealModel.Events.CHANGE, (dealModel: HoldemPokerAfterCallModel) => {
            rawCardAfterClickDeal(this.pokerCardScript, dealModel, () => this.gameData.stateModel.afterDeal());
        });
        this.gameData.dealModel.on(HoldemPokerAfterDealModel.Events.CHANGE, () =>
            this.gameData.roundCounter.change(this.gameData.dealModel.roundId)
        );
    }

    private registerBetEvents() {
        this.gameData.on(HoldemPokerGameData.Events.CHOICES_RESULT, updatePreviousChoices(this.gameData.placeBetModel));
        this.gameData.on(HoldemPokerGameData.Events.CHANGE_STATE, () => this.gameData.stateModel.afterDeal());
        this.gameData.on(HoldemPokerGameData.Events.SHOW_PROCESSING_BET, () => this.showProcessingWarning(true));
        this.gameData.on(HoldemPokerGameData.Events.HIDE_PROCESSING_BET, () => this.showProcessingWarning(false));
        this.gameData.ownBets.on(HoldemPokerOwnBet.Events.OWN_BETS, showRejoinOwnBets(this.gameData));
        this.gameData.ownBets.on(HoldemPokerOwnBet.Events.OWN_BETS, showRejoinTotalBet(this.totalBetLabel));
        this.gameData.ownBets.on(HoldemPokerOwnBet.Events.OWN_BETS, updateRoundCounter(this.gameData.roundCounter));
        this.gameData.ownBets.on(HoldemPokerOwnBet.Events.OWN_BETS, (ownBets: HoldemPokerOwnBet) => {
            rawCardWhenRejoin(this.pokerCardScript, ownBets);
        });
    }

    private registerRoundCounterEvents() {
        this.gameData.roundCounter.on(HoldemPokerRoundCounter.Events.CHANGE, updateRoundId(this.gameRound));
    }

    private registerSettlementEvents() {
        this.gameData.on(HoldemPokerGameData.Events.SETTLED, () => this.gameData.stateModel.settle());
        this.gameData.finishModel.on(HoldemPokerFinishModel.Events.CHANGE_SETTLEMENT, () => {
            this.gameData.settlement.startSettlement();
        });

        this.gameData.settlement.on(
            HoldemPokerSettlement.Events.START_SETTLEMENT,
            showWinningOption(this.bettingAreas, this.holdemPokerChips, this.betChips, this.gameData, this)
        );

        this.gameData.settlement.on(HoldemPokerSettlement.Events.START_SHOW_CARDS, () => {
            rawCardAfterClickCall(
                this.pokerCardScript,
                this.gameData.callModel,
                () => {
                    this.md5Comp.createResultDetails(this.gameData.md5Model.md5);
                },
                () => {
                    this.gameData.settlement.finishShowCards();
                }
            );
        });
        this.gameData.finishModel.on(HoldemPokerFinishModel.Events.SHOWED_ANIMATION, () => {
            this.gameData.stateModel.afterCall();
        });
    }

    private registerNoticeEvents() {
        this.gameData.on(CommonEvents.API_ERROR, updateStatusGame(this.gameData));
        this.gameData.on(CommonEvents.NOTICE, showSlidingChipWithProcessingFail(this.gameData.stateModel, this.betChips.node));
        this.gameData.on(CommonEvents.UM, handleUM(this));
    }

    private registerTicketDetailEvents() {
        this.gameData.ticketDetailModel.on(HoldemPokerTicketDetailModel.Events.CHANGE, (data) => {
            renderTicketDetail(this.betHistoryController)(data);
        });
    }

    onDealClick() {
        this.playClick();
        this.placingBet.dealBet();
    }

    onDoubleClick() {
        this.playClick();
        this.placingBet.doubleBet(HoldemPokerChoicesConst.ante, this.gameData.placeBetModel.choices[HoldemPokerChoicesConst.ante]);
    }

    onCancelClick() {
        this.playClick();
        this.gameData.receiveUIData({
            cancel: {}
        });
    }

    onRebetAndDeal() {
        this.playClick();
        this.hideButtonPrepareNewRound();
        collectCart(this.pokerCardScript, () => this.placingBet && this.placingBet.rebetAndDeal());
        clearAllBetChips(this.bettingAreas)();
        this.holdemPokerChips.stopWinningEffect();
        this.clearWinningBet();
    }

    onDoubleAndCallClick() {
        this.playClick();
        this.placingBet.doubleAndCallBet(
            HoldemPokerChoicesConst.call,
            this.gameData.placeBetModel.choices[HoldemPokerChoicesConst.ante] * 2
        );
    }

    sendRetryMessage(): void {
        this.connection.emit("retry");
    }

    onFoldClick() {
        this.playClick();
        this.gameData.receiveUIData({
            fold: {}
        });
        this.lockBet();
        this.connection.emit(events.bet, {
            fold: {}
        });
        this.gameData.isProcessingBet = true;
    }

    onNewButtonClick() {
        this.playClick();
        this.hideButtonPrepareNewRound();
        collectCart(
            this.pokerCardScript,
            () =>
                this.gameData &&
                this.gameData.receiveUIData({
                    new: {}
                })
        );
        clearAllBetChips(this.bettingAreas)();
        this.holdemPokerChips.stopWinningEffect();
        this.clearWinningBet();
    }

    private hideButtonPrepareNewRound() {
        this.reBetAndDealButton.active = this.newButton.active = false;
    }

    public getConfigs() {
        this.connection.emit(events.getGameConfigs);
    }

    public openMD5Guide() {
        const dialog = cc.instantiate(this.guidePrefab);
        const guide = dialog.getComponent(WebViewGuide);
        const { minBet, maxBet } = this.getBetRange();
        const locale = getLocale();
        const language = getLanguage(locale !== "vi-VN" && locale !== "en-US" ? "en-US" : locale);
        guide.initURL(this.gameId, language, { minBet, maxBet, used: this.isUsingMaxStakeLevel() }, "&md5=1");
        guide.sendDataToIframe(this.gameConfigs);
        this.currentMiniPanel.showGuide(dialog);
        guide.loadWebView();
    }

    playStartGameAudio() {
        AudioManager.getInstance().playSFX(this.startNewRoundAudio.clip);
    }

    playSingleChipsSound() {
        AudioManager.getInstance().playSFX(this.singleChipAudio.clip);
    }
}
