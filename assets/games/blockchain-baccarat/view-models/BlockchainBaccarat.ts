import { BlockchainBaccaratTimeHandler, BlockchainBaccaratBetHandler } from "../event-handlers/BlockchainBaccaratHandler";
import * as blockchainAction from "../actions/BlockchainBaccaratActions";
import {
    BlockchainBaccaratBetPercentageModel,
    BlockchainBaccaratConfigsModel,
    BlockchainBaccaratRoundHistoryModel,
    BlockchainBaccaratFinishModel,
    BlockchainBaccaratCardListModel,
    BlockchainBaccaratRoundHistory,
    BlockchainBaccaratFinish,
    Blockchain
} from "../event-models/BlockchainBaccaratModel";
import { GameIds } from "../../../configs/SabaConfigs";
import { BlockchainBaccaratChoicesType } from "../BlockchainBaccaratType";
import BlockchainBaccaratGameData from "../event-models/BlockchainBaccaratGameData";
import { BlockchainBaccaratConfig } from "./BlockchainBaccaratConfig";
import BlockchainBaccaratCardsUI from "./BlockchainBaccaratCardsUI";
import BlockchainBaccaratBetItem from "./BlockchainBaccaratBetItem";
import BlockchainBetOptionsUI from "./BlockchainBetOptionsUI";
import BlockchainBaccaratScoreboard from "../components/score-board/view-models/BlockchainBaccaratScoreBoard";
import BlockchainBaccaratLastRoundInfo from "../components/last-round-info/view-models/BlockchainBaccaratLastRoundInfo";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { payChips } from "../../_base/action/PayChipsAction";
import MD5Component from "../../_base/view-models/MD5Component";
import BlockchainCardList from "../components/card-list/view-models/BlockchainCardList";
import BlockchainCardVerification from "../components/card-list/view-models/BlockchainCardVerification";
import { consumeEvent, BlockchainBaccaratEvents } from "./BlockchainBaccaratEvents";
import TutorialMain from "../../../common/tutorial/TutorialMain";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccarat extends NewGameRoomBase {
    @property({ type: cc.Prefab, visible: false, override: true })
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property({ type: cc.Node, visible: false, override: true })
    miniRoundHistoryContainer: cc.Node = null;

    @property(cc.Prefab)
    cardListPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    cardVerificationPrefab: cc.Prefab = null;

    // hide node on node tree
    @property({ type: MD5Component, override: true, visible: false })
    md5Component: MD5Component = null;

    // hide node on node tree
    @property({ type: MD5Component, override: true, visible: false })
    musicBg: cc.AudioSource = null;

    @property(cc.Prefab)
    flashGuidePrefab: cc.Prefab = null;

    public gameData: BlockchainBaccaratGameData<BlockchainBaccaratChoicesType> = null;
    public cardList: BlockchainCardList = null;
    public cardsUI: BlockchainBaccaratCardsUI = null;
    public cardVerification: BlockchainCardVerification = null;
    public betOptionsUI: BlockchainBetOptionsUI = null;
    public scoreboard: BlockchainBaccaratScoreboard = null;
    public lastRoundIfo: BlockchainBaccaratLastRoundInfo = null;
    private readonly durationFlyChip = 1.2;
    private readonly durationAnimWinning = 2.8;
    public config: BlockchainBaccaratConfig;
    public timeHandler: BlockchainBaccaratTimeHandler;

    constructor() {
        super();
        this.gameId = GameIds.BlockchainBaccarat;
        this.setConfig(new BlockchainBaccaratConfig());
    }

    onLoad() {
        this.gameData = new BlockchainBaccaratGameData<BlockchainBaccaratChoicesType>();
        super.onLoad();
        this.registerRoundHistoryEvents();
        this.registerGameConfigEvents();
        this.registerBetPercentageEvents();
        this.registerCardListEvents();
        this.initCardList();
        this.initCardVerification();
        this.registerFinishEvents();
        this.registerNewBlockchainEvents();
        this.registerBlockchainEvents();
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

    private initBetOptionsUI(node: cc.Node) {
        this.betOptionsUI = node.getComponent(BlockchainBetOptionsUI);
        this.betOptionsUI.initBetOptions(this);
    }

    private initScoreBoardUI(node: cc.Node) {
        this.scoreboard = node.getComponent(BlockchainBaccaratScoreboard);
    }

    private initLastRoundInfo(node: cc.Node) {
        this.lastRoundIfo = node.getComponent(BlockchainBaccaratLastRoundInfo);
    }

    private initCardsUI(node: cc.Node) {
        this.cardsUI = node.getComponent(BlockchainBaccaratCardsUI);
    }

    initFlashGuide() {
        const storageKey = "blockchain_baccarat_flash_guide";
        const storage = cc.sys.localStorage.getItem(storageKey);
        const data = storage
            ? JSON.parse(storage)
            : {
                  enabled: true
              };
        if (!data.enabled || !this.flashGuidePrefab) {
            return;
        }
        this.openFlashGuide();
    }

    openFlashGuide() {
        this.playClick();
        const storageKey = "blockchain_baccarat_flash_guide";
        const node = cc.instantiate(this.flashGuidePrefab);
        this.currentMiniPanel.addDialog(node);
        const tutorialMain = node.getComponent(TutorialMain);
        tutorialMain.setTimeConfig([]);
        tutorialMain.endSlideCallBack = () => {
            cc.sys.localStorage.setItem(storageKey, JSON.stringify({ enabled: false }));
        };
        tutorialMain.show();
    }

    private openCardList() {
        this.playClick();
        this.cardList.node.active = true;
        this.cardList.updateBlockchain(this.gameData.cardList.blockchain);
        this.cardList.setData();
        this.cardList.showDialog();
    }

    initHandlers() {
        super.initHandlers();
        this.timeHandler = new BlockchainBaccaratTimeHandler(this);
        this.betHandler = new BlockchainBaccaratBetHandler(this);
    }

    private registerCardListEvents() {
        this.gameData.cardList.on(BlockchainBaccaratCardListModel.Events.UPDATE_CURRENT_INDEX, (currentIndex: number) => {
            this.cardsUI.handleNumberIndex(currentIndex);
        });
    }

    private registerBetPercentageEvents() {
        this.gameData.betPercentage.on(BlockchainBaccaratBetPercentageModel.Events.CHANGE, (totalBet) => {
            blockchainAction.handlePercentBet(this.betItems as BlockchainBaccaratBetItem[], this.timeHandler.isInRoundTime)(totalBet);
        });
    }

    private registerGameConfigEvents() {
        this.gameData.configs.on(BlockchainBaccaratConfigsModel.Events.CHANGE, blockchainAction.updateGameConfigs(this));
    }

    private registerRoundHistoryEvents() {
        this.gameData.roundHistory.on(
            BlockchainBaccaratRoundHistoryModel.Events.CHANGE,
            (roundHistory: BlockchainBaccaratRoundHistory[]) => {
                this.initFlashGuide();
                blockchainAction.updateWinning(
                    this.betOptionsUI,
                    this.cardsUI,
                    this.timeHandler,
                    this.gameData.cardList
                )(roundHistory, this.gameData.cardList.currentIndex);
                blockchainAction.updateLastRoundInfo(this.timeHandler, this.lastRoundIfo)(
                    roundHistory,
                    this.gameData.cardList.currentIndex
                );
                blockchainAction.renderScoreboard(this.scoreboard)(roundHistory);
                blockchainAction.updateCardDropBox(this.cardsUI)(
                    this.gameData.cardList.currentIndex,
                    this.gameData.cardList.blockchain.cutCardIndex
                );
            }
        );
    }

    private registerFinishEvents() {
        this.gameData.finishModel.on(BlockchainBaccaratFinishModel.Events.CHANGE_SETTLEMENT, (finishData: BlockchainBaccaratFinish) => {
            this.gameData.cardList.calculateCardsFly(finishData.blockchain.currentIndex);
            blockchainAction.openCards(this.cardsUI)(finishData, () => {
                //show winning
                blockchainAction.showLabelWinning(this.betOptionsUI, this.cardsUI)(finishData.settlementResult);
                blockchainAction.showHighLightBet(this.betOptionsUI)(finishData.settlementResult);
                this.scoreboard.renderScoreBoardEachRound(finishData);
                blockchainAction.renderCardSettlement(this.cardList)(finishData);
                payChips(this, finishData.settlementResult, finishData.winningPlayers, this.durationFlyChip, this.durationAnimWinning);
                this.gameData.cardList.change(finishData?.blockchain);
                this.finishShowResult = true;
            });
        });
    }

    private registerNewBlockchainEvents() {
        this.gameData.cardList.on(BlockchainBaccaratCardListModel.Events.UPDATE_NEW_BLOCKCHAIN, (newBlockchain: Blockchain) => {
            blockchainAction.updateBlockchainCardList(this.cardList)(newBlockchain);
            this.gameData.cardList.currentIndex = newBlockchain.currentIndex;
            this.gameData.cardList.numberCardsFly = 6;
        });
    }

    private registerBlockchainEvents() {
        this.gameData.cardList.on(BlockchainBaccaratCardListModel.Events.CHANGE, (blockchain: Blockchain) => {
            this.cardList.updateBlockchain(blockchain);
        });
    }

    private registerCardVerification() {
        consumeEvent(BlockchainBaccaratEvents.CHANGE_CARD, (params) => {
            blockchainAction.highLightCardSelected(this.cardList)(params["index"], this.openCardList.bind(this));
        });

        consumeEvent(BlockchainBaccaratEvents.OPEN_VERIFICATION, (params) => {
            const index = params["index"];
            this.cardList.initCardVerification(this.gameData.cardList.mainBlockChain.chain[index], index);
        });

        consumeEvent(BlockchainBaccaratEvents.RESET_CARD_SELECTED, () => {
            this.cardList.resetHighLightCurrentCardSelected();
        });

        consumeEvent(BlockchainBaccaratEvents.FLIPPED_CARD, (params) => {
            blockchainAction.renderCardVerification(
                this.cardVerification,
                this.gameData.finishModel.finishData?.blockchain
            )(params["index"]);
        });

        consumeEvent(BlockchainBaccaratEvents.OPENED_CARD, (params) => {
            blockchainAction.updateMainBlockchain(this.gameData.cardList)(
                this.gameData.finishModel.finishData?.blockchain,
                params["index"]
            );
        });

        consumeEvent(BlockchainBaccaratEvents.HIDE_TOOLTIPS, () => {
            this.cardVerification.onHideTooltips();
        });
    }

    handleShowGameId(status: boolean) {
        this.gameRound.node.active = status;
    }
}
