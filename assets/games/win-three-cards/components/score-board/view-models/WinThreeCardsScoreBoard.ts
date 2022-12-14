import WinThreeCardsBigRoad from "./WinThreeCardsBigRoad";
import WinThreeCardsRoundResult from "./WinThreeCardsRoundResult";

const { ccclass, property } = cc._decorator;

enum StatisticChildrenName {
    dragon = 0,
    phoenix,
    pair8Plus
}
@ccclass
export default class WinThreeCardsScoreBoard extends cc.Component {
    @property([WinThreeCardsBigRoad])
    bigRoads: WinThreeCardsBigRoad = null;

    @property(cc.Label)
    statistic: cc.Label[] = [];

    @property(cc.Node)
    roundResultContainer: cc.Node = null;

    @property(cc.Prefab)
    roundResultPrefab: cc.Prefab = null;

    derivedScoreBoardController: any;

    private roundHistory: any[] = [];

    resetScoreboard(): void {
        this.roundHistory = [];
        this.bigRoads.resetBoard();

        this.resetStatistic();
    }

    renderScoreBoardInGame(roundHistory: any[]) {
        this.roundHistory = roundHistory;
        console.log(roundHistory);
        this.bigRoads.renderScoreBoardInGame(roundHistory);
        this.renderStatistic();
        this.updateRoundResult(roundHistory);
    }

    renderScoreBoardEachRound(roundHistory: any[]) {
        // this.roundHistory.unshift(lastRound);
        this.bigRoads.renderScoreBoardInGame(roundHistory);
        this.renderStatistic();
        this.updateRoundResult(roundHistory);
    }

    renderNextNode() {
        this.bigRoads.renderNextNode();
    }

    private renderStatistic() {
        const data = this.roundHistory.reduce(
            (total, round) => {
                for (const key in total) {
                    total[key] += +round.settlementResult[key];
                }
                return total;
            },
            {
                dragon: 0,
                phoenix: 0,
                pair8Plus: 0
            }
        );

        Object.values(StatisticChildrenName)
            .filter((value) => typeof value !== "number")
            .forEach((name: string, index: number) => {
                this.statistic[index].string = data[name].toString();
            });
    }

    private resetStatistic() {
        this.statistic.forEach((label: cc.Label) => {
            label.string = "0";
        });
    }

    updateRoundResult(dataLogs: any[]) {
        this.roundResultContainer.destroyAllChildren();

        for (const dataLog of dataLogs) {
            const { result } = dataLog;
            const roundResultNode = cc.instantiate(this.roundResultPrefab);
            const roundResultComponent = roundResultNode.getComponent(WinThreeCardsRoundResult);
            roundResultComponent.changeColorText(result);
            this.roundResultContainer.addChild(roundResultNode);
        }
    }
}
