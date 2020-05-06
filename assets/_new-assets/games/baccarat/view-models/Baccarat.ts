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
        this.betChips.throwChip(this.currentBet, this.betItems[0].chipNode, new cc.Vec2(80, 40))
        this.bet({ cuoc: { red: true, cuoc: this.currentBet, box: box } });
    }
}
