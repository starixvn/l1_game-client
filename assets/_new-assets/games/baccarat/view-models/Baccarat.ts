const { ccclass, property } = cc._decorator;
import GameRoomBase from "../../_base/GameRoomBase";
import BaccaratTimeHandler from "./data-handlers/BaccaratTimeDataHandler";
import { BaccaratConfigs } from "./BaccaratConfigs";
import BaccaratCards from "./BaccaratCards";
import BaccaratFinishHandler from "./data-handlers/BaccaratFInishHandler";
import BaccaratHistory from "./BaccaratHistory";
import BaccaratLogsHandler from "./data-handlers/BaccaratLogsHandler";

@ccclass
export default class Baccarat extends GameRoomBase {
    @property(cc.Prefab)
    cardsPrefab: cc.Prefab = null;

    @property(BaccaratCards)
    playerCards: BaccaratCards = null;

    @property(BaccaratCards)
    bankerCards: BaccaratCards = null;

    @property(cc.Node)
    historyBoardNode: cc.Node = null;

    @property(cc.Prefab)
    historyBoardPrefab: cc.Prefab = null;

    cardsResource: any = null;

    public historyBoard: BaccaratHistory;

    onLoad() {
        this.init("baccarat", new BaccaratConfigs())
        super.onLoad();
        this.initCards();

        const historyBoardNode = cc.instantiate(this.historyBoardPrefab);
        this.historyBoard = historyBoardNode.getComponent("BaccaratHistory");
        this.historyBoard.init(this);
        this.historyBoardNode.addChild(historyBoardNode);
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

    initHandlers() {
        super.initHandlers();

        this.timeHandler = new BaccaratTimeHandler(this);
        this.finishHandler = new BaccaratFinishHandler(this);
        this.logsHandler = new BaccaratLogsHandler(this);
    }

    private initCards() {
        var cardsNode = cc.instantiate(this.cardsPrefab);
        this.cardsResource = cardsNode.getComponent("Card");
        this.cardsResource.init();
        this.bankerCards.init(this.cardsResource);
        this.playerCards.init(this.cardsResource);
    }
}
