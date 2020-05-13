const { ccclass, property } = cc._decorator;
import GameRoomBase from "../../_base/GameRoomBase";
import BaccaratTimeHandler from "./data-handlers/BaccaratTimeDataHandler";
import { BaccaratConfigs } from "./BaccaratConfigs";
import BaccaratCards from "./BaccaratCards";
import BaccaratFinishHandler from "./data-handlers/BaccaratFInishHandler";

@ccclass
export default class Baccarat extends GameRoomBase {
    @property(cc.Prefab)
    cardsPrefab: cc.Prefab = null;

    @property(BaccaratCards)
    playerCards: BaccaratCards = null;

    @property(BaccaratCards)
    bankerCards: BaccaratCards = null;

    cardsResource: any = null;

    constructor() {
        super();

        this.timeHandler = new BaccaratTimeHandler(this);
        this.finishHandler = new BaccaratFinishHandler(this);
    }

    onLoad() {
        this.init("baccarat", new BaccaratConfigs())
        super.onLoad();
        this.initCards();
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

    private initCards() {
        var cardsNode = cc.instantiate(this.cardsPrefab);
        this.cardsResource = cardsNode.getComponent("Card");
        this.cardsResource.init();
        this.bankerCards.init(this.cardsResource);
        this.playerCards.init(this.cardsResource);
    }
}
