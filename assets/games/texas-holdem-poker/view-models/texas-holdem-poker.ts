import { HoldemPockerMD5Model } from "./../../holdem-poker/event-models/HoldemPockerMD5Model";
import { events } from "../../_new/connection/SocketIOConnection";
import NewButton from "../../../common/custom-button/NewButton";
import GameRoomMenu from "../../../common/expandable-menu/view-models/GameRoomMenu";
import PrefabLoader from "../../../common/PrefabLoader";
import { GameIds } from "../../../configs/SabaConfigs";
import { CommonEvents } from "../../_new/_base/game-data-management/models/common-events";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { BettingAreaEvents } from "../../_new/common/betting-area/BettingArea";
import MicroUIAction from "../actions/texas-holdem-poker-microUI-action";
import {
    clearAllBetChips,
    clearBetChips,
    showHideButtons,
    showHideTooltip,
    showPlaceBetChips,
    updateAllChips,
    updateChips
} from "../actions/texas-holdem-poker-place-bet-actions";
import { updatePreviousChoices } from "../actions/texas-holdem-poker-rejoin-room-actions";
import { showWinningOption } from "../actions/texas-holdem-poker-settlement-actions";
import { renderTicketDetail } from "../actions/texas-holdem-poker-ticket-detail-actions";
import { showUMInfo } from "../actions/texas-holdem-poker-um-actions";
import { TexasHoldemPokerAfterCallModel } from "../event-models/texas-holdem-poker-call-model";
import TexasHoldemPokerChoices, { BetActionConst, TexasHoldemPokerChoicesConst } from "../event-models/texas-holdem-poker-choices";
import { TexasHoldemPokerConfigs } from "../event-models/texas-holdem-poker-configs";
import { TexasHoldemPokerAfterDealModel } from "../event-models/texas-holdem-poker-deal-model";
import { TexasHoldemPokerFinishModel } from "../event-models/texas-holdem-poker-finish-model";
import { TexasHoldemPokerGameData } from "../event-models/texas-holdem-poker-game-data";
import { TexasHoldemPokerOwnBetModel } from "../event-models/texas-holdem-poker-own-bet-model";
import { TexasHoldemPokerPlaceBetModel } from "../event-models/texas-holdem-poker-place-bet-model";
import { TexasHoldemPokerSettlement } from "../event-models/texas-holdem-poker-settlement";
import { TexasHoldemPokerTicketDetailModel } from "../event-models/texas-holdem-poker-ticket-detail-model";
import { TexasHoldemPokerAfterTurnModel } from "../event-models/texas-holdem-poker-turn-model";
import {
    collectCards,
    dealFirstThreeCommunityCards,
    dealPlayerAndDealerCards,
    dealSecondCard,
    dealThirdCardAndFaceUpDealerCards
} from "../texas-cards-component/view-models/cards-wrapper";
import TexasHoldemPokerCards from "../texas-cards-component/view-models/texas-holdem-poker-cards";
import { updateLeftOddsTable, updateMinMax, updateRightOddsTable } from "./../actions/texas-holdem-poker-configs-actions";
import { prepareNewRound, showOwnBet } from "./../actions/texas-holdem-poker-place-bet-actions";
import { showRejoinOwnBets } from "./../actions/texas-holdem-poker-rejoin-room-actions";
import { TexasHoldemPokerAfterRiverModel } from "./../event-models/texas-holdem-poker-river-model";
import { TexasHoldemPokerStateModel } from "./../event-models/texas-holdem-poker-state-model";
import { dealFourAndFireCardAndFaceUpDealerCards, rawCardWhenRejoin } from "./../texas-cards-component/view-models/cards-wrapper";
// import TexasTicketHistory from "./game-history/texas-ticket-history";
import TexasHoldemPokerBettingArea from "./texas-holdem-poker-betting-area";
import TexasHoldemPokerChips from "./texas-holdem-poker-chip";
import TexasHoldemPokerMinMaxTable from "./texas-holdem-poker-min-max-table";
import TexasHoldemPokerOddsTable from "./texas-holdem-poker-odds-table";
import TexasHoldemPokerPlacingBet from "./texas-holdem-poker-placing-bet";
import HoldemPockerMD5 from "../../holdem-poker/view-models/HoldemPockerMD5";
import AudioManager from "../../../common/audio/AudioManager";
import { updateMD5 } from "../../holdem-poker/actions/HoldemPokerMD5Action";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TexasHoldemPoker extends NewGameRoomBase {
    @property({ type: [PrefabLoader] })
    protected prefabLoader: PrefabLoader[] = [];

    @property({ type: [cc.Component] })
    protected bettingAreas: TexasHoldemPokerBettingArea[] = [];

    @property({ type: [MicroUIAction] })
    protected microUIAction: MicroUIAction[] = [];

    @property(cc.Node)
    gameMenuContainer: cc.Node = null;

    @property(cc.Node)
    doubleButton: cc.Node = null;

    @property(cc.Node)
    reBetButton: cc.Node = null;

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

    @property({ type: TexasHoldemPokerMinMaxTable })
    protected minMaxTable: TexasHoldemPokerMinMaxTable = null;

    @property({ type: [TexasHoldemPokerOddsTable] })
    protected oddsTables: TexasHoldemPokerOddsTable[] = [];

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

    private placingBet: TexasHoldemPokerPlacingBet = null;
    protected gameData: TexasHoldemPokerGameData<TexasHoldemPokerChoices> = null;
    private texasHoldemPokerChips: TexasHoldemPokerChips;
    protected colorItem = "#4d2a0e";
    protected colorIconMain = "#4d2a0e";
    pokerCardScript: TexasHoldemPokerCards = undefined;
    // private betHistoryController: TexasTicketHistory = null;

    constructor() {
        super();
        this.gameId = GameIds.TexasHoldemPoker;
    }

    onLoad() {
        this.gameData = new TexasHoldemPokerGameData<TexasHoldemPokerChoices>();
        this.texasHoldemPokerChips = new TexasHoldemPokerChips();
        this.microUIAction.forEach((e) => e.connectGameData(this.gameData));
        super.onLoad();
    }

    start() {
        super.start();

        this.initMenu();
        this.initPlacingBet();
        this.initButtonStatus();
        // this.initTicketHistory();

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
        this.pokerCardScript = this.node.getChildByName("poker-cards-script").getComponent(TexasHoldemPokerCards);
    }

    onGameHide() {}

    private registerConfigsEvents() {
        this.gameData.configs.on(TexasHoldemPokerConfigs.Events.CHANGE, (configs: TexasHoldemPokerConfigs) => {
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

        // this.reBetButton.getComponent(NewButton).callback.selected = () =>
        //     !this.reBetButton.getChildByName(disableButton).active && this.onRebetClick();

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
        // const dialog = cc.instantiate(this.historyPrefab);
        // this.betHistoryController = dialog.getComponent(TexasTicketHistory);
        // this.betHistoryController.init(this);
        // this.betHistoryController.setConnection(this.connection, this.gameName, this.gameData.ownBetModel.roundId);
        // this.betHistoryController.node.active = false;
        // this.globalMenuContainer.addChild(dialog);
    }

    private pressedShowHistory() {
        // this.playClick();
        // this.betHistoryController.setId(this.gameData.ownBetModel.roundId);
        // this.betHistoryController.showDialog();
    }

    private pressedShowGuide() {
        // this.playClick();
        // const gameGuide = this.globalMenuContainer.getChildByName(this.guidePrefab.data.name);
        // if (gameGuide) {
        //     gameGuide.removeFromParent(true);
        //     gameGuide.destroy();
        // }
        // const guideNode = cc.instantiate(this.guidePrefab);
        // guideNode.getComponent(TexasHoldemPokerGameGuide).init(this.gameData.configs);
        // this.globalMenuContainer.addChild(guideNode);
    }

    private initPlacingBet() {
        this.placingBet = new TexasHoldemPokerPlacingBet(this.gameData, this, () => this.connection);
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
            TexasHoldemPokerPlaceBetModel.Events.PLACE_BET_CHIPS,
            showPlaceBetChips(this.bettingAreas, this.betChips, this.shadowChip, this.texasHoldemPokerChips, this.gameData)
        );

        this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.CLEAR_BET_CHIPS, clearBetChips(this.bettingAreas));
        this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.CLEAR_ALL_BET_CHIPS, clearAllBetChips(this.bettingAreas));
        this.gameData.placeBetModel.on(
            TexasHoldemPokerPlaceBetModel.Events.UPDATE_ALL_CHIPS,
            updateAllChips(this.bettingAreas, this.betChips, this.shadowChip, this.texasHoldemPokerChips)
        );
        this.gameData.placeBetModel.on(
            TexasHoldemPokerPlaceBetModel.Events.UPDATE_CHIPS,
            updateChips(this.bettingAreas, this.betChips, this.shadowChip, this.texasHoldemPokerChips)
        );

        this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.PLACE_BET, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.DOUBLE, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.CALL, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.TURN, showOwnBet(this.gameData, this.bettingAreas));
        this.gameData.placeBetModel.on(TexasHoldemPokerPlaceBetModel.Events.RIVER, showOwnBet(this.gameData, this.bettingAreas));
    }

    private registerSettlementEvents() {
        this.gameData.on(TexasHoldemPokerGameData.Events.SETTLED, () => this.gameData.stateModel.settle());
        this.gameData.finishModel.on(TexasHoldemPokerFinishModel.Events.CHANGE_SETTLEMENT, () => {
            this.gameData?.settlement.startSettlement();
        });

        this.gameData?.settlement.on(
            TexasHoldemPokerSettlement.Events.START_SETTLEMENT,
            showWinningOption(this.bettingAreas, this.texasHoldemPokerChips, this.betChips, this.gameData, this)
        );

        this.gameData?.settlement.on(TexasHoldemPokerSettlement.Events.START_SHOW_CARDS, () => {
            dealThirdCardAndFaceUpDealerCards(this.pokerCardScript, this.gameData.riverModel, () => {
                this.gameData?.settlement.finishShowCards();
            });
        });

        this.gameData?.settlement.on(TexasHoldemPokerSettlement.Events.START_AUTO_CHECK, () => {
            this.turnButton.active = this.checkTurnButton.active = this.riverButton.active = this.checkRiverButton.active = false;
            this.reBetAndDealButton.active = this.reBetButton.active = this.newButton.active = false;
            dealFourAndFireCardAndFaceUpDealerCards(this.pokerCardScript, this.gameData.autoSettleModel, () => {
                this.gameData?.settlement.finishShowCards();
            });
        });

        this.gameData?.finishModel.on(TexasHoldemPokerFinishModel.Events.SHOWED_ANIMATION, () => {
            this.gameData?.stateModel.riveSuccess();
        });

        this.gameData?.finishModel.on(TexasHoldemPokerFinishModel.Events.SHOWED_ANIMATION, () => {
            this.gameData.settlement.autoSettle = false;
        });
    }

    public getConfigs() {
        this.connection.emit(events.getGameConfigs);
    }

    private registerStateEvents() {
        this.gameData.stateModel.on(TexasHoldemPokerStateModel.Events.CHANGE, showHideButtons(this));
        this.gameData.stateModel.on(TexasHoldemPokerStateModel.Events.CHANGE, showHideTooltip(this.bettingAreas));
        this.gameData.stateModel.on(TexasHoldemPokerStateModel.Events.PREPARE_NEW_ROUND, prepareNewRound(this.gameData.placeBetModel));
        this.gameData.stateModel.on(TexasHoldemPokerStateModel.Events.FORCE_UPDATE_BALANCE, () => this.updateUserBalance());
    }

    private registerAfterDealEvents() {
        this.gameData.dealModel.on(TexasHoldemPokerAfterDealModel.Events.CHANGE, (dealModel: TexasHoldemPokerAfterDealModel) => {
            dealPlayerAndDealerCards(this.pokerCardScript, dealModel, () => this.gameData.stateModel.afterDeal());
        });
    }
    private registerAfterCallEvents() {
        this.gameData.callModel.on(TexasHoldemPokerAfterCallModel.Events.CHANGE, (callModel: TexasHoldemPokerAfterCallModel) => {
            dealFirstThreeCommunityCards(this.pokerCardScript, callModel, () => this.gameData.stateModel.callSuccess());
        });
    }
    private registerAfterTurnEvents() {
        this.gameData.turnModel.on(TexasHoldemPokerAfterTurnModel.Events.CHANGE, (turnModel: TexasHoldemPokerAfterTurnModel) => {
            dealSecondCard(this.pokerCardScript, turnModel, () => this.gameData.stateModel.turnSuccess());
        });
    }

    private registerAfterRiverEvents() {
        this.gameData.riverModel.on(TexasHoldemPokerAfterRiverModel.Events.CHANGE, () => {
            this.gameData.settlement.waiting = true;
        });
    }

    private registerBetEvents() {
        this.gameData.on(TexasHoldemPokerGameData.Events.CHOICES_RESULT, updatePreviousChoices(this.gameData.placeBetModel));
        this.gameData.on(TexasHoldemPokerGameData.Events.SHOW_PROCESSING_BET, () => this.showProcessingWarning(true));
        this.gameData.on(TexasHoldemPokerGameData.Events.HIDE_PROCESSING_BET, () => this.showProcessingWarning(false));

        this.gameData.ownBets.on(TexasHoldemPokerOwnBetModel.Events.OWN_BETS, showRejoinOwnBets(this.gameData));
        this.gameData.ownBets.on(TexasHoldemPokerOwnBetModel.Events.OWN_BETS, (ownBets: TexasHoldemPokerOwnBetModel) => {
            rawCardWhenRejoin(this.pokerCardScript, ownBets);
        });
    }

    private registerTicketDetailEvents() {
        this.gameData.ticketDetailModel.on(TexasHoldemPokerTicketDetailModel.Events.CHANGE, renderTicketDetail(this.betHistoryController));
    }

    private registerNoticeEvents() {
        this.gameData.on(CommonEvents.NOTICE, (text) => this.showMiniWarning(text));
        this.gameData.on(CommonEvents.UM, showUMInfo(this));
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
        this.placingBet.doubleBet(
            TexasHoldemPokerChoicesConst.anteBet,
            this.gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.anteBet]
        );
    }

    onClearClick() {
        this.playClick();
        this.placingBet.clear();
    }

    onDoubleAndCallClick() {
        this.playClick();
        this.placingBet.handleClickButton(
            TexasHoldemPokerChoicesConst.callBet,
            this.gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.anteBet] * 2,
            BetActionConst.doubleCall
        );
    }

    onTurnClick() {
        this.playClick();
        this.placingBet.handleClickButton(
            TexasHoldemPokerChoicesConst.turnBet,
            this.gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.anteBet],
            BetActionConst.betTurn
        );
    }

    onCheckTurnClick() {
        this.playClick();
        this.placingBet.handleClickButtonNoneBet(TexasHoldemPokerChoicesConst.checkTurn);
    }

    onRiverClick() {
        this.playClick();
        this.placingBet.handleClickButton(
            TexasHoldemPokerChoicesConst.riverBet,
            this.gameData.placeBetModel.choices[TexasHoldemPokerChoicesConst.anteBet],
            BetActionConst.betRiver
        );
    }

    onCheckRiverClick() {
        this.playClick();
        this.placingBet.handleClickButtonNoneBet(TexasHoldemPokerChoicesConst.checkRiver);
    }

    // onRebetClick() {
    //     this.playClick();
    //     this.hideButtonPrepareNewRound();
    //     collectCards(this.pokerCardScript, () => this.placingBet && this.placingBet.rebet());
    // }

    onRebetAndDeal() {
        this.playClick();
        this.hideButtonPrepareNewRound();
        collectCards(this.pokerCardScript, () => this.placingBet && this.placingBet.rebetAndDeal());
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
    }

    onFoldClick() {
        this.playClick();
        this.placingBet.handleClickButtonNoneBet(TexasHoldemPokerChoicesConst.fold);
    }

    private hideButtonPrepareNewRound() {
        this.reBetAndDealButton.active = this.reBetButton.active = this.newButton.active = false;
    }

    playStartGameAudio() {
        AudioManager.getInstance().playSFX(this.startNewRoundAudio.clip);
    }
}
