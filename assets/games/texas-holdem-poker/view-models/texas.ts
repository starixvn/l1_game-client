import { HoldemPockerMD5Model } from "./../../holdem-poker/event-models/HoldemPockerMD5Model";
import { events } from "../../_new/connection/SocketIOConnection";
import NewButton from "../../../common/custom-button/NewButton";
import GameRoomMenu from "../../../common/expandable-menu/view-models/GameRoomMenu";
import PrefabLoader from "../../../common/PrefabLoader";
import { GameIds } from "../../../configs/SabaConfigs";
import { CommonEvents } from "../../_new/_base/game-data-management/models/common-events";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { BettingAreaEvents } from "../../_new/common/betting-area/BettingArea";
import TexasMicroUIAction from "../actions/texas-microUI-action";
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
import TexasCallModel from "../event-models/texas-call-model";
import { TexasChoicesType } from "../texas-type";
import { TexasChoicesConst, BetAction } from "../texas-contants";
import TexasConfigsModel from "../event-models/texas-configs-model";
import TexasDealModel from "../event-models/texas-deal-model";
import TexasFinishModel from "../event-models/texas-finish-model";
import TexasGameDataModel from "../event-models/texas-game-data-model";
import TexasOwnBetModel from "../event-models/texas-own-bet-model";
import TexasPlaceBetModel from "../event-models/texas-place-bet-model";
import TexasSettlementModel from "../event-models/texas-settlement-model";
import TexasTicketDetailModel from "../event-models/texas-ticket-detail-model";
import TexasTurnModel from "../event-models/texas-turn-model";
import {
    collectCards,
    dealFirstThreeCommunityCards,
    dealPlayerAndDealerCards,
    dealSecondCard,
    dealThirdCardAndFaceUpDealerCards
} from "../cards-component/view-models/cards-wrapper";
import TexasCards from "../cards-component/view-models/texas-cards";
import { updateLeftOddsTable, updateMinMax, updateRightOddsTable } from "./../actions/texas-configs-actions";
import { prepareNewRound, showOwnBet } from "./../actions/texas-place-bet-actions";
import { showRejoinOwnBets } from "./../actions/texas-rejoin-room-actions";
import TexasRiverModel from "./../event-models/texas-river-model";
import TexasStateModel from "./../event-models/texas-state-model";
import { dealFourAndFireCardAndFaceUpDealerCards, rawCardWhenRejoin } from "../cards-component/view-models/cards-wrapper";
import TexasBettingArea from "./texas-betting-area";
import TexasChips from "./texas-chips";
import TexasMinMax from "./texas-min-max";
import TexasOddsTable from "./texas-odds-table";
import TexasPlacingBet from "./texas-placing-bet";
import HoldemPockerMD5 from "../../holdem-poker/view-models/HoldemPockerMD5";
import AudioManager from "../../../common/audio/AudioManager";
import { updateMD5 } from "../../holdem-poker/actions/HoldemPokerMD5Action";
import TexasTicketHistory from "./game-history/texas-ticket-history";
import { renderTicketDetail } from "./../actions/texas-ticket-detail-actions";
import { handleMD5 } from "./../actions/texas-md5-action";
import { handleUM } from "../../holdem-poker/actions/HoldemPokerUmAction";
import { updateStatusGame } from "../../holdem-poker/actions/HoldemPokerNoticeActions";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Texas extends NewGameRoomBase {
    @property({ type: [PrefabLoader] })
    protected prefabLoader: PrefabLoader[] = [];

    @property({ type: [cc.Component] })
    protected bettingAreas: TexasBettingArea[] = [];

    @property({ type: [TexasMicroUIAction] })
    protected microUIAction: TexasMicroUIAction[] = [];

    @property(cc.Node)
    gameMenuContainer: cc.Node = null;

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

    @property(cc.SpriteFrame)
    shadowChip: cc.SpriteFrame = null;

    @property({ type: TexasMinMax })
    protected minMaxTable: TexasMinMax = null;

    @property({ type: [TexasOddsTable] })
    protected oddsTables: TexasOddsTable[] = [];

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

    protected placingBet: TexasPlacingBet = null;
    protected gameData: TexasGameDataModel<TexasChoicesType> = null;
    protected TexasChipss: TexasChips;
    protected colorItem = "#4d2a0e";
    protected colorIconMain = "#4d2a0e";
    pokerCardScript: TexasCards = undefined;
    protected betHistoryController: TexasTicketHistory = null;

    constructor() {
        super();
        this.gameId = GameIds.TexasHoldemPoker;
    }

    onLoad() {
        this.gameData = new TexasGameDataModel<TexasChoicesType>();
        this.TexasChipss = new TexasChips();
        this.microUIAction.forEach((e) => e.connectGameData(this.gameData));
        super.onLoad();
    }

    start() {
        super.start();

        this.initMenu();
        this.initPlacingBet();
        this.initButtonStatus();

        this.prefabLoader.forEach((loader) => loader.initialize());

        this.registerStateEvents();
        this.registerConfigsEvents();
        this.initPokerCardScript();
        this.registerBettingAreasEvents();
        this.registerPlaceBetEvents();
        this.registerAfterDealEvents();
        this.registerAfterCallEvents();
        this.registerAfterTurnEvents();
        this.registerAfterRiverEvents();
        this.registerBetEvents();
        this.registerSettlementEvents();
        this.registerTicketDetailEvents();
        this.registerNoticeEvents();
        this.registerMD5Event();
    }

    initPokerCardScript() {
        this.pokerCardScript = this.node.getChildByName("poker-cards-script").getComponent(TexasCards);
    }

    onGameHide: () => void;

    private registerConfigsEvents() {
        this.gameData.configs.on(TexasConfigsModel.Events.CHANGE, (configs: TexasConfigsModel) => {
            this.setGameConfigs(configs);
            updateMinMax(this.minMaxTable)(configs);
            updateLeftOddsTable(this.oddsTables[0])(configs);
            updateRightOddsTable(this.oddsTables[1])(configs);
        });
    }

    protected addHandlers(): void {
        super.addHandlers(this.noticeHandler, this.errorHandler, this.betHandler);
    }

    onDataGameRoom(data: any) {
        super.onDataGameRoom(data);
        if (this.gameData) {
            this.gameData.receiveData(data);
        }
    }

    private initButtonStatus() {
        const disableButton = "btn-disable";
        this.dealButton.getComponent(NewButton).callback.selected = () =>
            !this.dealButton.getChildByName(disableButton).active && this.onDealClick();

        this.cancelButton.getComponent(NewButton).callback.selected = () =>
            !this.cancelButton.getChildByName(disableButton).active && this.onClearClick();

        this.doubleButton.getComponent(NewButton).callback.selected = () =>
            !this.doubleButton.getChildByName(disableButton).active && this.onDoubleClick();

        this.callButton.getComponent(NewButton).callback.selected = () =>
            !this.callButton.getChildByName(disableButton).active && this.onDoubleAndCallClick();

        this.turnButton.getComponent(NewButton).callback.selected = () =>
            !this.turnButton.getChildByName(disableButton).active && this.onTurnClick();

        this.checkTurnButton.getComponent(NewButton).callback.selected = () =>
            !this.checkTurnButton.getChildByName(disableButton).active && this.onCheckTurnClick();

        this.riverButton.getComponent(NewButton).callback.selected = () =>
            !this.riverButton.getChildByName(disableButton).active && this.onRiverClick();

        this.checkRiverButton.getComponent(NewButton).callback.selected = () =>
            !this.checkRiverButton.getChildByName(disableButton).active && this.onCheckRiverClick();

        this.reBetAndDealButton.getComponent(NewButton).callback.selected = () =>
            !this.reBetAndDealButton.getChildByName(disableButton).active && this.onRebetAndDeal();

        this.newButton.getComponent(NewButton).callback.selected = () =>
            !this.newButton.getChildByName(disableButton).active && this.onNewButtonClick();

        this.foldButton.getComponent(NewButton).callback.selected = () =>
            !this.foldButton.getChildByName(disableButton).active && this.onFoldClick();
    }

    private initMenu() {
        const gameRoomMenu = this.gameMenuContainer.getComponent(GameRoomMenu);
        const menuAction = [this.onCloseGameClick, this.pressedShowHistory, this.openGuide];
        gameRoomMenu.initialize(this.node, this).addCommonIcon().withEvents(menuAction);
    }

    private initTicketHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.betHistoryController = dialog.getComponent(TexasTicketHistory);
        this.betHistoryController.init(this as any);
        this.betHistoryController.setConnection(this.connection, this.gameName, this.gameData.roundCounter.roundId);
        this.betHistoryController.node.active = false;
        this.currentMiniPanel.addDialog(dialog);
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
        this.placingBet = new TexasPlacingBet(this.gameData, this, () => this.connection);
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
        this.gameData.placeBetModel.on(
            TexasPlaceBetModel.Events.PLACE_BET_CHIPS,
            showPlaceBetChips(this.bettingAreas, this.betChips, this.shadowChip, this.TexasChipss)
        );

        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.CLEAR_BET_CHIPS, clearBetChips(this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.CLEAR_ALL_BET_CHIPS, clearAllBetChips(this.bettingAreas));
        this.gameData.placeBetModel.on(
            TexasPlaceBetModel.Events.UPDATE_ALL_CHIPS,
            updateAllChips(this.bettingAreas, this.betChips, this.shadowChip, this.TexasChipss)
        );
        this.gameData.placeBetModel.on(
            TexasPlaceBetModel.Events.UPDATE_CHIPS,
            updateChips(this.bettingAreas, this.betChips, this.shadowChip, this.TexasChipss)
        );

        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.PLACE_BET, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.DOUBLE, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.CALL, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.TURN, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasPlaceBetModel.Events.RIVER, showOwnBet(this.gameData, this.bettingAreas));
    }

    private registerSettlementEvents() {
        this.gameData.on(TexasGameDataModel.Events.SETTLED, () => this.gameData.stateModel.settle());
        this.gameData.finishModel.on(TexasFinishModel.Events.CHANGE_SETTLEMENT, () => {
            this.gameData?.settlement.startSettlement();
        });

        this.gameData?.settlement.on(
            TexasSettlementModel.Events.START_SETTLEMENT,
            showWinningOption(this.bettingAreas, this.TexasChipss, this.betChips, this.gameData, this)
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
            dealFourAndFireCardAndFaceUpDealerCards(this.pokerCardScript, this.gameData.autoSettleModel, () => {
                this.gameData?.settlement.finishShowCards();
            });
        });

        this.gameData?.finishModel.on(TexasFinishModel.Events.SHOWED_ANIMATION, () => {
            this.gameData?.stateModel.riveSuccess();
        });

        this.gameData?.finishModel.on(TexasFinishModel.Events.SHOWED_ANIMATION, () => {
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
        this.gameData.dealModel.on(TexasDealModel.Events.CHANGE, (dealModel: TexasDealModel) => {
            dealPlayerAndDealerCards(this.pokerCardScript, dealModel, () => this.gameData.stateModel.afterDeal());
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

        this.gameData.ownBets.on(TexasOwnBetModel.Events.OWN_BETS, showRejoinOwnBets(this.gameData));
        this.gameData.ownBets.on(TexasOwnBetModel.Events.OWN_BETS, (ownBets: TexasOwnBetModel) => {
            rawCardWhenRejoin(this.pokerCardScript, ownBets);
        });
    }

    private registerTicketDetailEvents() {
        this.gameData.ticketDetailModel.on(TexasTicketDetailModel.Events.CHANGE, (data) => {
            renderTicketDetail(this.betHistoryController)(data);
        });
    }

    private registerNoticeEvents() {
        this.gameData.on(CommonEvents.API_ERROR, updateStatusGame(this.gameData));
        this.gameData.on(CommonEvents.NOTICE, (text) => this.showMiniWarning(text));
        this.gameData.on(CommonEvents.UM, handleUM(this));
    }

    private registerMD5Event() {
        this.gameData.md5Model.on(HoldemPockerMD5Model.Events.CHANGE, (md5: HoldemPockerMD5Model) => {
            updateMD5(this.md5Comp)(md5);
        });
    }

    onDealClick() {
        this.playClick();
        this.placingBet.handleClickDeal();
    }

    onDoubleClick() {
        this.playClick();
        this.placingBet.doubleBet(TexasChoicesConst.anteBet, this.gameData.placeBetModel.choices[TexasChoicesConst.anteBet]);
    }

    onClearClick() {
        this.playClick();
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
        this.hideButtonPrepareNewRound();
        collectCards(this.pokerCardScript, () => this.placingBet && this.placingBet.rebetAndDeal());
        clearAllBetChips(this.bettingAreas)();
        this.TexasChipss.stopWinningEffect();
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
        this.TexasChipss.stopWinningEffect();
        this.clearWinningBet();
    }

    onFoldClick() {
        this.playClick();
        this.placingBet.handleClickButtonNoneBet(TexasChoicesConst.fold);
    }

    private hideButtonPrepareNewRound() {
        this.reBetAndDealButton.active = this.newButton.active = false;
    }

    playStartGameAudio() {
        AudioManager.getInstance().playSFX(this.startNewRoundAudio.clip);
    }
}
