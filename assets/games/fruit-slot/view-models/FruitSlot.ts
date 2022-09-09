import { FruitSlotRoundHistory } from "./../event-handlers/FruitSlotRoundHistoryHandler";
import NewGameRoomBase from "../../_new/_base/NewGameRoomBase";
import { FruitSlotConfig } from "./FruitSlotConfig";
import FruitSlotBetOptionsUI from "./FruitSlotBetOptionsUI";
import FruitSlotTimeHandler from "../event-handlers/FruitSlotTimeHandler";
import FruitSlotGameData from "../event-models/FruitSlotGameData";
import { History } from "../../_new/_base/game-data-management/models/history";
import FruitSlotMiniRoundHistory from "./FruitSlotMiniRoundHistory";
import FruitSlotStatistic from "./FruitSlotStatistic";

const { ccclass, property } = cc._decorator;

export const FruitSlotGameId = 59;

@ccclass
export default class FruitSlot extends NewGameRoomBase {
    @property(cc.Prefab)
    statisticPrefab: cc.Prefab = null;

    public gameData: FruitSlotGameData = null;
    public config: FruitSlotConfig;
    public betOptionsUI: FruitSlotBetOptionsUI = null;
    public miniRoundHistory: FruitSlotMiniRoundHistory = null;
    public statistic: FruitSlotStatistic = null;

    constructor() {
        super();
        this.gameId = FruitSlotGameId;
        this.setConfig(new FruitSlotConfig());
    }

    onLoad() {
        this.gameData = new FruitSlotGameData();
        super.onLoad();
        this.registerRoundHistoryEvents();
        this.initStatistic();
    }

    openStatistic() {
        this.playClick();
        this.statistic.node.active = true;
        this.statistic.render(this.gameData.roundHistory.list);
        this.statistic.commonDialog.showDialog();
    }

    private initBetOptionsUI(node: cc.Node) {
        this.betOptionsUI = node.getComponent(FruitSlotBetOptionsUI);
        this.betOptionsUI.initBetOptions(this);
    }

    private initMiniRoundHistory(node: cc.Node) {
        this.miniRoundHistory = node.getComponent(FruitSlotMiniRoundHistory);
        this.miniRoundHistory.init(this);
    }

    private initStatistic() {
        const statisticNode = cc.instantiate(this.statisticPrefab);
        this.statistic = statisticNode.getComponent(FruitSlotStatistic);
        this.statistic.node.active = false;
        this.currentMiniPanel.addDialog(statisticNode);
    }

    private registerRoundHistoryEvents() {
        this.gameData.roundHistory.on(History.Events.CHANGE, (roundHistory: FruitSlotRoundHistory[]) => {
            this.miniRoundHistory.render(roundHistory);
        });
    }
}
