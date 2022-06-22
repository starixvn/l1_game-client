import { BlockchainBaccaratTimeHandler, BlockchainBaccaratBetHandler } from "../event-handlers/BlockchainBaccaratHandler";
import * as blockchainAction from "../actions/BlockchainBaccaratActions";
import {
    BlockchainBaccaratConfigsModel,
    BlockchainBaccaratTotalBetModel,
    BlockchainBaccaratRoundHistoryModel,
    BlockchainBaccaratFinishModel,
    BlockchainBaccaratCardListModel,
    BlockchainBaccaratRoundHistory,
    BlockchainBaccaratFinish
} from "../event-models/BlockchainBaccaratModel";
import { GameIds } from "../../../configs/SabaConfigs";
import { BlockchainBaccaratChoicesType } from "../BlockchainBaccaratType";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BlockchainBaccaratConfig } from "./BlockchainBaccaratConfig";
import BlockchainCardList from "./card-list/BlockchainCardList";
import BlockchainBaccaratCardsUI from "./BlockchainBaccaratCardsUI";
import BlockchainBaccaratBetItem from "./BlockchainBaccaratBetItem";
import BlockchainBetOptionsUI from "./BlockchainBetOptionsUI";
import BlockchainBaccaratScoreboard from "../components/score-board/view-models/BlockchainBaccaratScoreBoard";
import BlockchainBaccaratLastRoundInfo from "../components/last-round-info/view-models/BlockchainBaccaratLastRoundInfo";
import BlockchainBaccaratTicketHistory from "./history/BlockchainBaccaratTicketHistory";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { updateOtherPlayerBalance } from "../../_base/action/OtherPlayerAction";
import { payChips } from "../../_base/action/PayChipsAction";
import MD5Component from "../../_base/view-models/MD5Component";
import BlockchainCardVerification, { CardEvents } from "./card-list/BlockchainCardVerification";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccarat extends NewGameRoomBase {
    @property({ type: cc.Prefab, visible: false, override: true })
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property({ type: cc.Node, visible: false, override: true })
    miniRoundHistoryContainer: cc.Node = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    cardListPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    cardVerificationPrefab: cc.Prefab = null;

    @property({ type: MD5Component, override: true, visible: false })
    md5Component: MD5Component = null;

    public gameData: BlockchainBaccaratGameData<BlockchainBaccaratChoicesType> = null;
    public cardList: BlockchainCardList = null;
    public cardsUI: BlockchainBaccaratCardsUI = null;
    public cardVerification: BlockchainCardVerification = null;
    public betOptionsUI: BlockchainBetOptionsUI = null;
    public scoreboard: BlockchainBaccaratScoreboard = null;
    public lastRoundIfo: BlockchainBaccaratLastRoundInfo = null;
    private betHistoryController: BlockchainBaccaratTicketHistory = null;
    private readonly durationFlyChip = 1.2;
    private readonly durationAnimWinning = 3;

    constructor() {
        super();
        this.gameId = GameIds.BlockchainBaccarat;
        this.setConfig(new BlockchainBaccaratConfig());
        this.setMiniPanelScale(1);
    }

    onLoad() {
        this.gameData = new BlockchainBaccaratGameData<BlockchainBaccaratChoicesType>();
        this.registerGameEvents();
        super.onLoad();
        this.initCardList();
        this.initCardVerification();
        this.registerFinishEvents();
        this.registerNewBlockchainEvents();
        this.registerCardVerification();
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.cardsUI?.winningNotice && (this.cardsUI.winningNotice.node.parent.active = false);
    }

    private initCardList() {
        const dialog = cc.instantiate(this.cardListPrefab);
        this.cardList = dialog.getComponent(BlockchainCardList);
        this.cardList.init(this);
        this.cardList.node.active = false;
        this.currentMiniPanel.addDialog(dialog);
    }

    private initCardVerification() {
        const cardVerificationNode = cc.instantiate(this.cardVerificationPrefab);
        this.cardVerification = cardVerificationNode.getComponent(BlockchainCardVerification);
        this.cardVerification.node.active = false;
        this.currentMiniPanel.addDialog(cardVerificationNode);
    }

    initBetOptionsUI(node: cc.Node) {
        this.betOptionsUI = node.getComponent(BlockchainBetOptionsUI);
        this.betOptionsUI.initBetOptions(this);
    }

    initScoreBoardUI(node: cc.Node) {
        this.scoreboard = node.getComponent(BlockchainBaccaratScoreboard);
    }

    initLastRoundInfo(node: cc.Node) {
        this.lastRoundIfo = node.getComponent(BlockchainBaccaratLastRoundInfo);
    }

    initCardsUI(node: cc.Node) {
        this.cardsUI = node.getComponent(BlockchainBaccaratCardsUI);
    }

    openCardList() {
        this.cardList.updateBlockchain(this.gameData.cardList.blockchain);
        this.cardList.setData();
        this.cardList.showDialog();
    }

    initHandlers() {
        super.initHandlers();
        this.timeHandler = new BlockchainBaccaratTimeHandler(this);
        this.betHandler = new BlockchainBaccaratBetHandler(this);
    }

    onDataGameRoom(data: any) {
        super.onDataGameRoom(data);
        if (this.gameData) {
            this.gameData.receiveData(data);
        }
    }

    openHistory() {
        this.playClick();
        const historyNode = cc.instantiate(this.historyPrefab);
        this.betHistoryController = historyNode.getComponent(BlockchainBaccaratTicketHistory);
        this.betHistoryController.setConnection(this.connection, this.gameName);
        this.currentMiniPanel.addDialog(historyNode);
        this.betHistoryController.showDialog();
    }

    private registerGameEvents() {
        this.gameData.configs.on(BlockchainBaccaratConfigsModel.Events.CHANGE, blockchainAction.updateGameConfigs(this));
        this.gameData.totalBet.on(BlockchainBaccaratTotalBetModel.Events.CHANGE, (totalBet) => {
            blockchainAction.handlePercentBet(this.betItems as BlockchainBaccaratBetItem[])(totalBet);
        });
        this.gameData.roundHistory.on(
            BlockchainBaccaratRoundHistoryModel.Events.CHANGE,
            (roundHistory: BlockchainBaccaratRoundHistory[]) => {
                blockchainAction.handleJoinRoom(this)(roundHistory, this.gameData.cardList.currentIndex);
            }
        );

        this.gameData.cardList.on(BlockchainBaccaratCardListModel.Events.UPDATE_CURRENT_INDEX, (currentIndex: number) => {
            this.cardsUI.handleNumberIndex(currentIndex);
        });
    }

    private registerFinishEvents() {
        this.gameData.finishModel.on(BlockchainBaccaratFinishModel.Events.CHANGE_SETTLEMENT, blockchainAction.renderCardSettlement(this));
        this.gameData.finishModel.on(BlockchainBaccaratFinishModel.Events.CHANGE_SETTLEMENT, (finishData: BlockchainBaccaratFinish) => {
            this.gameData.cardList.handleCurrentIndex(finishData.blockchain.currentIndex);
            blockchainAction.openCards(this.cardsUI)(finishData, () => {
                //show winning
                blockchainAction.showLabelWinning(this)(finishData.settlementResult);
                blockchainAction.showHighLightBet(this)(finishData.settlementResult);
                this.scoreboard.renderScoreBoardEachRound(finishData);
                if (this.playerHandler) {
                    updateOtherPlayerBalance(finishData.winningPlayers, this);
                }
                payChips(this, finishData.settlementResult, finishData.winningPlayers, this.durationFlyChip, this.durationAnimWinning);
                this.finishShowResult = true;
            });
        });
    }

    private registerNewBlockchainEvents() {
        this.gameData.cardList.on(BlockchainBaccaratCardListModel.Events.UPDATE_NEW_BLOCKCHAIN, (newBlockchain: Blockchain) => {
            blockchainAction.updateBlockchainCardList(this)(newBlockchain);
        );
    }

    private registerCardVerification() {
        this.cardVerification.node.on(CardEvents.CHANGE_CARD, () => {
            this.openCardList();
        });
    }
}
