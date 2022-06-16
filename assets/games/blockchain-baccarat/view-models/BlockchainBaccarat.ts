import { showHighLightBet } from "./../actions/BlockchainBaccaratWinningAction";
import { BlockchainBaccaratRoundHistory } from "./../event-models/BlockchainBaccaratRoundHistory";
import { handleJoinRoom } from "./../actions/BlockchainBaccaratJoinRoomAction";
import { updateGameConfigs } from "../actions/BlockchainBaccaratConfigsAction";
import { GameIds } from "../../../configs/SabaConfigs";
import { BlockchainBaccaratChoicesType } from "../BlockchainBaccaratType";
import BlockchainBaccaratTimeHandler from "../event-handlers/BlockchainBaccaratTimeHandler";
import BlockchainBaccaratConfigsModel from "../event-models/BlockchainBaccaratConfigsModel";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BlockchainBaccaratConfig } from "./BlockchainBaccaratConfig";
import BlockchainBaccaratBetHandler from "../event-handlers/BlockchainBaccaratBetHandler";
import BlockchainCardList from "./card-list/BlockchainCardList";
import BlockchainBaccaratCardsUI from "./BlockchainBaccaratCardsUI";
import BlockchainBaccaratTotalBetModel from "../event-models/BlockchainBaccaratTotalBetModel";
import { handlePercentBet } from "../actions/BlockchainBaccaratTotalBetAction";
import BlockchainBaccaratBetItem from "./BlockchainBaccaratBetItem";
import BlockchainBetOptionsUI from "./BlockchainBetOptionsUI";
import BlockchainBaccaratScoreboard from "../components/score-board/view-models/BlockchainBaccaratScoreBoard";
import BlockchainBaccaratRoundHistoryModel from "../event-models/BlockchainBaccaratRoundHistoryModel";
import { renderCardSettlement, updateBlockchainCardList } from "../actions/BlockchainBaccaratCardListActions";
import { BlockchainBaccaratFinish, BlockchainBaccaratFinishModel } from "../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccaratCardListModel, { Blockchain } from "../event-models/BlockchainBaccaratCardListModel";
import { openCards } from "../actions/BlockchainBaccaratCardsActions";
import BlockchainBaccaratLastRoundInfo from "../components/last-round-info/view-models/BlockchainBaccaratLastRoundInfo";
import BlockchainBaccaratTicketHistory from "./history/BlockchainBaccaratTicketHistory";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { showLabelWinning } from "../actions/BlockchainBaccaratWinningAction";

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

    @property(cc.Node)
    cardsContainer: cc.Node = null;

    @property(cc.Label)
    winNoticeLabel: cc.Label = null;

    gameData: BlockchainBaccaratGameData<BlockchainBaccaratChoicesType> = null;
    public cardList: BlockchainCardList = null;
    cardsUI: BlockchainBaccaratCardsUI = null;
    betOptionsUI: BlockchainBetOptionsUI = null;
    scoreboard: BlockchainBaccaratScoreboard = null;
    lastRoundIfo: BlockchainBaccaratLastRoundInfo = null;
    private betHistoryController: BlockchainBaccaratTicketHistory = null;

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
        this.registerFinishEvents();
        this.registerNewBlockchainEvents();
    }

    resetDataAndUI() {
        super.resetDataAndUI();

        this.winNoticeLabel.node.parent.active = false;
    }

    private initCardList() {
        const dialog = cc.instantiate(this.cardListPrefab);
        this.cardList = dialog.getComponent(BlockchainCardList);
        this.cardList.init(this);
        this.cardList.node.active = false;
        this.currentMiniPanel.addDialog(dialog);
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
        this.initCardList();
        this.cardList.setData(this.gameData.cardList.blockchain);
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

    handlePositionMiniRoundHistory() {
        //handlePositionMiniRoundHistory
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
        this.gameData.configs.on(BlockchainBaccaratConfigsModel.Events.CHANGE, updateGameConfigs(this));
        this.gameData.totalBet.on(BlockchainBaccaratTotalBetModel.Events.CHANGE, (totalBet) => {
            handlePercentBet(this.betItems as BlockchainBaccaratBetItem[])(totalBet);
        });
        this.gameData.roundHistory.on(
            BlockchainBaccaratRoundHistoryModel.Events.CHANGE,
            (roundHistory: BlockchainBaccaratRoundHistory[]) => {
                this.scoreboard.renderScoreBoardInGame(roundHistory);
                this.lastRoundIfo.updateUI(roundHistory[0], this.gameData.cardList.currentIndex);

                handleJoinRoom(this)(roundHistory[0], this.gameData.cardList.currentIndex);
            }
        );

        this.gameData.cardList.on(BlockchainBaccaratCardListModel.Events.UPDATE_CURRENT_INDEX, (blockchain: Blockchain) => {
            this.cardsUI.handleNumberIndex(blockchain.currentIndex);
        });
    }

    private registerFinishEvents() {
        this.gameData.finishModel.on(BlockchainBaccaratFinishModel.Events.CHANGE_SETTLEMENT, renderCardSettlement(this));
        this.gameData.finishModel.on(BlockchainBaccaratFinishModel.Events.CHANGE_SETTLEMENT, (finishData: BlockchainBaccaratFinish) => {
            this.gameData.cardList.handleCurrentIndex(finishData.blockchain.currentIndex);
            openCards(this.cardsUI)(finishData, () => {
                //show winning
                showLabelWinning(this)(finishData.settlementResult);
                showHighLightBet(this)(finishData.settlementResult);
                this.scoreboard.renderScoreBoardEachRound(finishData);
            });
        });
    }

    private registerNewBlockchainEvents() {
        this.gameData.cardList.on(BlockchainBaccaratCardListModel.Events.UPDATE_NEW_BLOCKCHAIN, () => {
            updateBlockchainCardList(this);
            this.scoreboard.resetScoreboard();
            this.lastRoundIfo.reset();
        });
    }
}
