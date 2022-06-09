import { updateGameConfigs } from "../actions/BlockchainBaccaratConfigsAction";
import ExpandableMenu from "../../../common/expandable-menu/view-models/ExpandableMenu";
import { GameIds } from "../../../configs/SabaConfigs";
import BaccaratHistory from "../../baccarat/view-models/BaccaratHistory";
import SocketIOTableGameBase from "../../_base/SocketIOTableGameBase";
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
import { renderScoreBoardInGame } from "../components/score-board/actions/BlockchainBaccaratScoreboardActions";
import { updateCardList } from "../actions/BlockchainBaccaratCardListActions";
import { BlockchainBaccaratFinish, BlockchainBaccaratFinishModel } from "../event-models/BlockchainBaccaratFinishModel";
import BlockchainBaccaratCardListModel, { Blockchain } from "../event-models/BlockchainBaccaratCardListModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccarat extends SocketIOTableGameBase {
    @property({ type: cc.Prefab, visible: false, override: true })
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property({ type: cc.Node, visible: false, override: true })
    miniRoundHistoryContainer: cc.Node = null;

    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    cardListPrefab: cc.Prefab = null;

    @property(cc.Node)
    cardsContainer: cc.Node = null;

    gameData: BlockchainBaccaratGameData<BlockchainBaccaratChoicesType> = null;
    public cardList: BlockchainCardList = null;
    cardsUI: BlockchainBaccaratCardsUI = null;
    betOptionsUI: BlockchainBetOptionsUI = null;
    scoreboard: BlockchainBaccaratScoreboard = null;

    constructor() {
        super();
        this.gameId = GameIds.BlockchainBaccarat;
        this.setConfig(new BlockchainBaccaratConfig());
        this.setMiniPanelScale(1);
    }

    onLoad() {
        this.gameData = new BlockchainBaccaratGameData<BlockchainBaccaratChoicesType>(this);
        super.onLoad();
        this.registerGameEvents();
        this.registerFinishEvents();
    }

    start(): void {
        super.start();
        this.initCardList();
    }

    private initCardList() {
        const dialog = cc.instantiate(this.cardListPrefab);
        this.cardList = dialog.getComponent(BlockchainCardList);
        this.cardList.node.active = false;
        this.cardList.init(this);
        this.currentMiniPanel.addDialog(dialog);
    }

    initBetOptionsUI(node: cc.Node) {
        this.betOptionsUI = node.getComponent(BlockchainBetOptionsUI);
        this.betOptionsUI.initBetOptions(this);
    }

    initScoreBoardUI(node: cc.Node) {
        this.scoreboard = node.getComponent(BlockchainBaccaratScoreboard);
    }

    initCardsUI(node: cc.Node) {
        this.cardsUI = node.getComponent(BlockchainBaccaratCardsUI);
    }

    openCardList() {
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
        this.expandableMenu.collapseMenu();
        const historyNode = cc.instantiate(this.historyPrefab);
        this.historyComponent = historyNode.getComponent("BaccaratHistory") as BaccaratHistory;
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(historyNode);
    }

    private registerGameEvents() {
        this.gameData.configs.on(BlockchainBaccaratConfigsModel.Events.CHANGE, updateGameConfigs(this));
        this.gameData.totalBet.on(BlockchainBaccaratTotalBetModel.Events.CHANGE, (totalBet) => {
            handlePercentBet(this.betItems as BlockchainBaccaratBetItem[])(totalBet);
        });
        this.gameData.roundHistory.on(BlockchainBaccaratRoundHistoryModel.Events.CHANGE, (roundHistory) => {
            renderScoreBoardInGame(this.scoreboard)(roundHistory);
        });

        this.gameData.finishModel.on(BlockchainBaccaratFinishModel.Events.CHANGE_SETTLEMENT, (finishData: BlockchainBaccaratFinish) => {
            this.gameData.cardList.handleCurrentIndex(finishData.blockchain.currentIndex);
        });
        this.gameData.cardList.on(BlockchainBaccaratCardListModel.Events.CHANGE, (blockchain: Blockchain) => {
            this.cardsUI.handleNumberIndex(blockchain.currentIndex);
        });
    }

    private registerFinishEvents() {
        this.gameData.finishModel.on(BlockchainBaccaratFinishModel.Events.CHANGE_SETTLEMENT, updateCardList(this));
    }
}
