const { ccclass, property } = cc._decorator;
import GameRoomBase from "../../_base/GameRoomBase";
import BaccaratTimeHandler from "./data-handlers/BaccaratTimeDataHandler";
import { BaccaratConfigs } from "./BaccaratConfigs";
import BaccaratCards from "./BaccaratCards";
import BaccaratFinishHandler from "./data-handlers/BaccaratFInishHandler";
import BaccaratLogsHandler from "./data-handlers/BaccaratLogsHandler";
import BasicHistoryBoard from "../../_base/view-models/BasicHistoryBoard";
import TotalHistoryBoard from "./TotalHistoryBoard";
import DragonScoreBoard from "../../_base/view-models/DragonScoreBoard";
import BaccaratHistory from "./BaccaratHistory";
import { games } from './../../../SabaConfigs';

@ccclass
export default class Baccarat extends GameRoomBase {
    @property(cc.Prefab)
    cardsPrefab: cc.Prefab = null;

    @property(BaccaratCards)
    playerCards: BaccaratCards = null;

    @property(BaccaratCards)
    bankerCards: BaccaratCards = null;

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

    cardsResource: any = null;
    basicHistoryBoard: BasicHistoryBoard;
    detailHistoryBoard: DragonScoreBoard;
    showScoreBoardNextDot = false;

    onLoad() {
        this.init("baccarat", new BaccaratConfigs(), null, 1, games.Baccarat.id)
        super.onLoad();
        this.initCards();
        this.initScoreBoards();
    }

    onData(data) {
        super.onData(data);
    }

    onDataGameRoom(data) {
        super.onDataGameRoom(data);
    }

    onBet(event, box) {
        this.bet({ bet: { red: true, bet: this.currentBet, box: box } });
    }

    openHistory() {
        const historyNode = cc.instantiate(this.historyPrefab);
        const history = historyNode.getComponent("BaccaratHistory") as BaccaratHistory;
        history.init(this);
        this.currentMiniPanel.node.addChild(historyNode);
    }

    openGuide() {
        const guideNode = cc.instantiate(this.guidePrefab);
        var guide = guideNode.getComponent("BaccaratGuide");
        guide.init(this.gameConfigs);
        this.currentMiniPanel.node.addChild(guideNode);
    }

    initHandlers() {
        super.initHandlers();

        this.timeHandler = new BaccaratTimeHandler(this);
        this.finishHandler = new BaccaratFinishHandler(this);
        this.logsHandler = new BaccaratLogsHandler(this);
    }

    resetDataAndUI() {
        super.resetDataAndUI();

        this.winNoticeLabel.node.parent.active = false;
    }

    private initCards() {
        var cardsNode = cc.instantiate(this.cardsPrefab);
        this.cardsResource = cardsNode.getComponent("Card");
        this.cardsResource.init();
        this.bankerCards.init(this.cardsResource);
        this.playerCards.init(this.cardsResource);
    }

    private initScoreBoards() {
        const condition = () => {
            const result = this.currentTimeRemaining < this.config.stopBetTime
                || this.showScoreBoardNextDot;

            return result;
        }

        const historyBoardNode = cc.instantiate(this.basicHistoryBoardPrefab);
        this.basicHistoryBoard = historyBoardNode.getComponent("BasicHistoryBoard");
        this.basicHistoryBoard.init(condition);
        this.basicHistoryBoardNode.addChild(historyBoardNode);

        const detailHistoryBoardNode = cc.instantiate(this.detailHistoryBoardPrefab);
        this.detailHistoryBoard = detailHistoryBoardNode.getComponent("BaccaratDragonScoreBoard");
        this.detailHistoryBoard.init(condition);
        this.detailHistoryBoardNode.addChild(detailHistoryBoardNode);
    }
}
