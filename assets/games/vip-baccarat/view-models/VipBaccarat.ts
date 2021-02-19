import GameUtils from "../../../common/GameUtils";
import { BaccaratConfigs } from "../../baccarat/view-models/BaccaratConfigs";
import TotalHistoryBoard from "../../baccarat/view-models/TotalHistoryBoard";
import SocketIOGameBase from "../../_base/SocketIOGameBase";
import BasicHistoryBoard from "../../_base/view-models/BasicHistoryBoard";
import DragonScoreBoard from "../../_base/view-models/DragonScoreBoard";
import { games } from "./../../../SabaConfigs";
import VipBaccaratBetHandler from "./data-handlers/VipBaccaratBetHandler";
import VipBaccaratFinishHandler from "./data-handlers/VipBaccaratFinishHandler";
import VipBaccaratLogsHandler from "./data-handlers/VipBaccaratLogsHandler";
import VipBaccaratTimeDataHandler from "./data-handlers/VipBaccaratTimeDataHandler";
import VipBaccaratCards from "./VipBaccaratCards";
import VipBaccaratHistory from "./VipBaccaratHistory";
import VipBaccaratMiniRoundHistory from "./VipBaccaratMiniRoundHistory";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VipBaccarat extends SocketIOGameBase {
    @property(VipBaccaratCards)
    playerCards: VipBaccaratCards = null;

    @property(VipBaccaratCards)
    bankerCards: VipBaccaratCards = null;

    @property(cc.Node)
    basicHistoryBoardNode: cc.Node = null;

    @property(cc.Prefab)
    basicHistoryBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    detailHistoryBoardNode: cc.Node = null;

    @property(cc.Prefab)
    detailHistoryBoardPrefab: cc.Prefab = null;

    @property(TotalHistoryBoard)
    totalHistoryBoard: TotalHistoryBoard = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property(cc.Label)
    winNoticeLabel: cc.Label = null;

    @property(cc.AudioSource)
    getCardAudioSource: cc.AudioSource = null;

    @property(cc.Prefab)
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property(cc.Node)
    miniRoundHistoryContainer: cc.Node = null;

    @property(cc.Node)
    chipContainer: cc.Node = null;

    @property(cc.Node)
    totalBetContainer: cc.Node = null;

    @property(cc.Node)
    ownBetContainer: cc.Node = null;

    basicHistoryBoard: BasicHistoryBoard;
    detailHistoryBoard: DragonScoreBoard;
    showScoreBoardNextDot = false;
    public miniRoundHistory: VipBaccaratMiniRoundHistory;
    private historyComponent: VipBaccaratHistory;

    constructor() {
        super();
        this.internalInit();
    }

    protected internalInit() {
        this.init("VipBaccarat", new BaccaratConfigs(), null, 1, games.VipBaccarat.id);
    }

    onLoad() {
        super.onLoad();
        this.initCards();
        this.initScoreBoards();
        this.initMiniRoundHistory();

        this.betItems.forEach((item) => {
            GameUtils.moveToOtherNode(item.chipNode, this.chipContainer);
            GameUtils.moveToOtherNode(item.totalBet.node, this.totalBetContainer);
            GameUtils.moveToOtherNode(item.ownBet.node, this.ownBetContainer);
        });

        this.miniRoundHistory.tip.node.zIndex = 100;
        GameUtils.moveToOtherNode(this.miniRoundHistory.tip.node, this.ownBetContainer);
    }

    initHandlers() {
        super.initHandlers();

        this.timeHandler = new VipBaccaratTimeDataHandler(this);
        this.finishHandler = new VipBaccaratFinishHandler(this);
        this.logsHandler = new VipBaccaratLogsHandler(this);
        this.betHandler = new VipBaccaratBetHandler(this);
    }

    openHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(VipBaccaratHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(dialog);
    }

    onDataGameRoom(data) {
        if (data.history) {
            this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }

    openGuide() {
        const guideNode = cc.instantiate(this.guidePrefab);
        const guide = guideNode.getComponent("BaccaratGuide");
        guide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(guideNode);
    }

    resetDataAndUI() {
        super.resetDataAndUI();

        this.winNoticeLabel.node.parent.active = false;
    }

    playGetCardAudio() {
        this.getCardAudioSource.play();
    }

    private initCards() {
        this.bankerCards.init(() => {
            this.playGetCardAudio();
        });
        this.playerCards.init(() => {
            this.playGetCardAudio();
        });
    }

    private initScoreBoards() {
        const condition = () => {
            return this.currentTimeRemaining < this.config.stopBetTime || this.showScoreBoardNextDot;
        };

        const historyBoardNode = cc.instantiate(this.basicHistoryBoardPrefab);
        this.basicHistoryBoard = historyBoardNode.getComponent("BasicHistoryBoard");
        this.basicHistoryBoard.init(condition);
        this.basicHistoryBoardNode.addChild(historyBoardNode);

        const detailHistoryBoardNode = cc.instantiate(this.detailHistoryBoardPrefab);
        this.detailHistoryBoard = detailHistoryBoardNode.getComponent("BaccaratDragonScoreBoard");
        this.detailHistoryBoard.init(condition);
        this.detailHistoryBoardNode.addChild(detailHistoryBoardNode);
    }

    initMiniRoundHistory() {
        const condition = () => {
            return this.currentTimeRemaining < this.config.stopBetTime || this.showScoreBoardNextDot;
        };

        const mini = cc.instantiate(this.miniRoundHistoryPrefab);
        this.miniRoundHistory = mini.getComponent(VipBaccaratMiniRoundHistory);
        this.miniRoundHistory.init(condition);
        this.miniRoundHistoryContainer.addChild(mini);
    }
}
