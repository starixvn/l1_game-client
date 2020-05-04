const { ccclass, property } = cc._decorator;
import { numberWithCommas } from "../../../common/helpers/Helper";
import { GameConfigs } from "../../_base/view-models/GameConfigs";
import AnimatedTime from "../../../common/animated-time/view-models/AnimatedTime";
import GameRoomBase from "../../../common/game/GameRoomBase";
import BaccaratTimeHandler from "./data-handlers/BaccaratTimeDataHandler";
import BetChips from "../../../common/bet-chips/view-models/BetChips";

@ccclass
export default class Baccarat extends GameRoomBase {
    @property(cc.Node)
    centerNode: cc.Node = null;

    @property(cc.Label)
    gameRound: cc.Label = null;

    @property(cc.Label)
    totalBetPlayerHasPair: cc.Label = null;

    @property(cc.Label)
    totalBetBankerHasPair: cc.Label = null;

    @property(cc.Label)
    totalBetBig: cc.Label = null;

    @property(cc.Label)
    totalBetSmall: cc.Label = null;

    @property(cc.Label)
    totalBetTie: cc.Label = null;

    @property(cc.Label)
    totalBetPlayer: cc.Label = null;

    @property(cc.Label)
    totalBetBanker: cc.Label = null;

    @property(BetChips)
    betChips: BetChips = null;

    currentDataLogs = [];
    private currentBet: string;

    constructor() {
        super();

        this.timeHandler = new BaccaratTimeHandler(this);
    }
    onLoad() {
        var self = this;
        this.betChips.onChanged = ((bet) => {
            self.currentBet = bet;
        });

        super.onLoad();
    }

    onData(data) {
        super.onData(data);
    }

    onDataGameRoom(data) {
        super.onDataGameRoom(data);
    }

    setGameRound(gameRound) {
        if (gameRound) {
            this.gameRound.string = "#" + gameRound;
        }
    }

    onBet(event, box) {
        this.bet({ cuoc: { red: true, cuoc: this.currentBet, box: box } });
    }
}
