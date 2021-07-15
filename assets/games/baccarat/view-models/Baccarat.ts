import { GameIds } from "../../../configs/SabaConfigs";
import VipBaccarat from "../../vip-baccarat/view-models/VipBaccarat";
import BaccaratCards from "./BaccaratCards";
import BaccaratHistory from "./BaccaratHistory";
import BaccaratFinishHandler from "./data-handlers/BaccaratFinishHandler";
import BaccaratLogsHandler from "./data-handlers/BaccaratLogsHandler";
import BaccaratTimeHandler from "./data-handlers/BaccaratTimeDataHandler";

const { ccclass, property } = cc._decorator;
@ccclass
export default class Baccarat extends VipBaccarat {
    @property({ type: BaccaratCards, override: true })
    playerCards: BaccaratCards = null;

    @property({ type: BaccaratCards, override: true })
    bankerCards: BaccaratCards = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property({ type: cc.Node, visible: false, override: true })
    miniRoundHistoryContainer: cc.Node = null;

    protected internalInit() {
        super.internalInit();
        this.gameId = GameIds.Baccarat;
    }

    onLoad() {
        super.onLoad();
    }

    initHandlers() {
        super.initHandlers();

        this.timeHandler = new BaccaratTimeHandler(this);
        this.finishHandler = new BaccaratFinishHandler(this);
        this.logsHandler = new BaccaratLogsHandler(this);
    }

    getBetRange() {
        return this.getNormalBetRange();
    }

    handlePositionMiniRoundHistory() {}

    openHistory() {
        const historyNode = cc.instantiate(this.historyPrefab);
        this.historyComponent = historyNode.getComponent("BaccaratHistory") as BaccaratHistory;
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(historyNode);
    }

    initMiniRoundHistory() {}
}
