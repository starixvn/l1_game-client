import AudioManager from "../../../common/audio/AudioManager";
import GameUtils from "../../../common/GameUtils";
import { BaccaratConfigs } from "../../baccarat/view-models/BaccaratConfigs";
import TotalHistoryBoard from "../../baccarat/view-models/TotalHistoryBoard";
import WinThreeCardsBetHandler from "./data-handlers/WinThreeCardsBetHandler";
import WinThreeCardsFinishHandler from "./data-handlers/WinThreeCardsFinishHandler";
import WinThreeCardsLogsHandler from "./data-handlers/WinThreeCardsLogsHandler";
import WinThreeCardsTimeDataHandler from "./data-handlers/WinThreeCardsTimeDataHandler";
import WinThreeCardsCards from "./WinThreeCardsCards";
import WinThreeCardsHistory from "./history/WinThreeCardsHistory";
import BaccaratMd5Handler from "../../baccarat/view-models/data-handlers/BaccaratMd5Handler";
import BaccaratBigRoad from "../../_baccarat/view-models/BaccaratBigRoad";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import WinThreeCardsBasicHistoryBoard from "../components/score-board/view-models/WinThreeCardsBasicHistoryBoard";
import WinThreeCardsGameData from "./event-models/WinThreeCardsGameData";

const { ccclass, property } = cc._decorator;

export const WinThreeCardsId = 61;
@ccclass
export default class WinThreeCards extends NewGameRoomBase {
    @property({ type: WinThreeCardsCards })
    playerCards: WinThreeCardsCards = null;

    @property({ type: WinThreeCardsCards })
    bankerCards: WinThreeCardsCards = null;

    @property(cc.Node)
    basicHistoryBoardNode: cc.Node = null;

    @property(cc.Prefab)
    basicHistoryBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    bigRoadNode: cc.Node = null;

    @property(cc.Prefab)
    bigRoadPrefab: cc.Prefab = null;

    @property(TotalHistoryBoard)
    totalHistoryBoard: TotalHistoryBoard = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

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

    public gameData: WinThreeCardsGameData = null;
    basicHistoryBoard: WinThreeCardsBasicHistoryBoard;
    bigRoad: BaccaratBigRoad;
    showScoreBoardNextDot = false;

    constructor() {
        super();
        this.gameId = WinThreeCardsId;
        this.setConfig(new BaccaratConfigs());
    }

    onLoad() {
        this.gameData = new WinThreeCardsGameData();
        super.onLoad();
        this.initCards();
        this.initScoreBoards();

        this.betItems.forEach((item) => {
            GameUtils.moveToOtherNode(item.chipNode, this.chipContainer);
            GameUtils.moveToOtherNode(item.totalBet.node, this.totalBetContainer);
            GameUtils.moveToOtherNode(item.ownBet.node, this.ownBetContainer);
        });
    }

    resetDataAndUI() {
        super.resetDataAndUI();

        this.winNoticeLabel.node.parent.active = false;
    }

    initHandlers() {
        super.initHandlers();

        this.timeHandler = new WinThreeCardsTimeDataHandler(this);
        this.finishHandler = new WinThreeCardsFinishHandler(this);
        this.logsHandler = new WinThreeCardsLogsHandler(this);
        this.betHandler = new WinThreeCardsBetHandler(this);
        this.md5Handler = new BaccaratMd5Handler(this);
    }

    openHistory() {
        this.playClick();
        const dialog = cc.instantiate(this.historyPrefab);
        this.historyComponent = dialog.getComponent(WinThreeCardsHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(dialog);
        console.log("this.currentMiniPanel", this.currentMiniPanel);
    }

    playGetCardAudio() {
        // AudioManager.getInstance().playSFX(this.getCardAudioSource.clip);
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
        this.basicHistoryBoard = historyBoardNode.getComponent("WinThreeCardsBasicHistoryBoard");
        this.basicHistoryBoard.init(condition);
        this.basicHistoryBoardNode.addChild(historyBoardNode);

        const bigRoadNode = cc.instantiate(this.bigRoadPrefab);
        this.bigRoad = bigRoadNode.getComponent("WinThreeCardsBigRoad");
        this.bigRoadNode.addChild(bigRoadNode);
    }
}
