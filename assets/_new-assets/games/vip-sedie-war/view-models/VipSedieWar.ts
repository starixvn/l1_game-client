import MiniRoundHistory from "../../../common/mini-round-history/MiniRoundHistory";
import { games } from "../../../SabaConfigs";
import BetItem from "../../_base/BetItem";
import VipSedie from "../../vip-sedie/view-models/VipSedie";
import VipSedieWarTimeHandler from "./handlers/VipSedieWarTimeHandler";
import VipSedieWarFinishHandler from "./handlers/VipsSedieWarFinishHandler";
import SedieDish from "./SedieDish";
import { VipSedieWarConfigs } from "./VipSedieWarConfigs";
import VipSedieWarStatistic from "./VipSedieWarStatistic";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipSedieWar extends VipSedie {
    @property(VipSedieWarStatistic)
    leftStatistic: VipSedieWarStatistic = null;

    @property(VipSedieWarStatistic)
    rightStatistic: VipSedieWarStatistic = null;

    @property({ type: SedieDish })
    dishes: SedieDish[] = [];

    @property(cc.Node)
    betChoicesNode: cc.Node = null;

    protected internalInit() {
        this.init("VipSedieWar", new VipSedieWarConfigs(), null, 1, games.VipSedieWar.id);
        this.finishShowResult = false;
    }

    onLoad() {
        this.betChoicesNode.children.forEach(child => {
            const betItem = child.getComponent(BetItem);
            if (betItem) {
                this.betItems.push(betItem);
            }
        });
        super.onLoad();
    }

    updateRoundHistory() {
        this.leftStatistic.setData(this.currentDataLogs);
        this.rightStatistic.setData(this.currentDataLogs);

        const miniHistoryData = this.currentDataLogs.map((d) => {
            let result = 0;
            const list = ["player", "banker", "tie"];
            list.forEach((key, index) => {
                if (d.settlementResult[key]) {
                    result = index;
                }
            });

            let count = 0;
            const redList = ["red1", "red2", "red3", "red4"];
            redList.forEach((i) => {
                if (d.result.player[i]) {
                    count++;
                }
                if (d.result.banker[i]) {
                    count++;
                }
            });
            return {
                roundId: d.roundId,
                type: result,
                red: count,
                result: d.result
            }
        });
        this.miniRoundHistory.setData(miniHistoryData);
    }

    initHandlers() {
        super.initHandlers();
        this.finishHandler = new VipSedieWarFinishHandler(this);
        this.timeHandler = new VipSedieWarTimeHandler(this);
    }

    initRoundHistory() {
        const condition = () => {
            return this.currentTimeRemaining < this.config.stopBetTime || this.currentTimeRemaining > this.config.fullTime;
        };
        this.leftStatistic.sedieRoundHistory.logControl.init(condition);
        this.rightStatistic.sedieRoundHistory.logControl.init(condition);

        var mini = cc.instantiate(this.miniRoundHistoryPrefab);
        this.miniRoundHistory = mini.getComponent(MiniRoundHistory);
        this.miniRoundHistoryContainer.addChild(mini);
    }

    showResult() {
        if (this.currentDataLogs.length > 0) {
            const { result, settlementResult } = this.currentDataLogs[0];

            this.dishes[0].setDots(result.player);
            this.dishes[1].setDots(result.banker);

            this.betItems.forEach(betItem => betItem.setHighlight(settlementResult[betItem.node.name.toLowerCase()], true));
            this.updateRoundHistory();
        }
    }

    openPlate(animated: boolean) {
        this.dishes.forEach(dish => dish.openPlate(animated));

    }

    closePlate() {
        this.dishes.forEach(dish => dish.closePlate());
    }
}
