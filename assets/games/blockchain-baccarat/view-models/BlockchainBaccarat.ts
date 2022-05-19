import ExpandableMenu from "../../../common/expandable-menu/view-models/ExpandableMenu";
import { GameIds } from "../../../configs/SabaConfigs";
import BaccaratCards from "../../baccarat/view-models/BaccaratCards";
import BaccaratHistory from "../../baccarat/view-models/BaccaratHistory";
import VipBaccaratBetHandler from "../../vip-baccarat/view-models/data-handlers/VipBaccaratBetHandler";
import VipBaccaratTimeDataHandler from "../../vip-baccarat/view-models/data-handlers/VipBaccaratTimeDataHandler";
import VipBaccarat from "../../vip-baccarat/view-models/VipBaccarat";
import SocketIOTableGameBase from "../../_base/SocketIOTableGameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccarat extends SocketIOTableGameBase {
    @property({ type: BaccaratCards, override: true })
    playerCards: BaccaratCards = null;

    @property({ type: BaccaratCards, override: true })
    bankerCards: BaccaratCards = null;

    @property({ type: cc.Prefab, visible: false, override: true })
    miniRoundHistoryPrefab: cc.Prefab = null;

    @property({ type: cc.Node, visible: false, override: true })
    miniRoundHistoryContainer: cc.Node = null;

    @property(ExpandableMenu)
    expandableMenu: ExpandableMenu = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    constructor() {
        super();
        this.gameId = GameIds.BlockchainBaccarat;
    }

    onLoad() {
        super.onLoad();
    }

    initHandlers() {
        super.initHandlers();
        this.timeHandler = new VipBaccaratTimeDataHandler(this);
        this.betHandler = new VipBaccaratBetHandler(this as any);
    }

    handlePositionMiniRoundHistory() {
        //handlePositionMiniRoundHistory
    }

    openHistory() {
        this.playClick();
        this.expandableMenu.collapseMenu();
        const historyNode = cc.instantiate(this.historyPrefab);
        this.historyComponent = historyNode.getComponent("BaccaratHistory") as BaccaratHistory;
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.node.addChild(historyNode);
    }
}
