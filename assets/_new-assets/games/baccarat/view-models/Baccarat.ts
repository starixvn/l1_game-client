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

    private readonly betOptionMapper = {
        "big": 0,
        "small": 1,
        "tie": 2,
        "banker": 3,
        "player": 4
    }

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
        const index = this.betOptionMapper[box];
        this.betChips.throwChip(this.currentBet, this.betItems[index].chipNode, new cc.Vec2(80, 40))
        this.bet({ cuoc: { red: true, cuoc: this.currentBet, box: box } });
    }

    private initCards() {
        var cardsNode = cc.instantiate(this.cardsPrefab);
        this.cardsResource = cardsNode.getComponent("Card");
        this.cardsResource.init();
        this.bankerCards.init(this.cardsResource);
        this.playerCards.init(this.cardsResource);
    }
}
