import Keno from "./Keno";
import LogControl from "./LogControl";
import StatisticProgress from "../../../common/statistic-progress/StatisticProgress";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";

const { ccclass, property } = cc._decorator;
interface StatisticData {
    data: number[];
    statistic: number[];
}

enum HistoryOption {
    BigSmall = 0,
    EvenOdd,
    FiveElements
}

@ccclass
export default class RoundHistory extends cc.Component {

    @property(cc.Node)
    options: cc.Node = null;

    @property(LogControl)
    bigSmallLog: LogControl = null;

    @property(StatisticProgress)
    bigSmallProgress: StatisticProgress = null;

    @property(StatisticProgress)
    evenOddProgress: StatisticProgress = null;

    @property(StatisticProgress)
    fiveElementProgress: StatisticProgress = null;

    @property(LogControl)
    sharedLog: LogControl = null;

    @property({ type: cc.Node })
    bigSmallItem: cc.Node[] = [];

    @property({ type: cc.Node })
    evenOddItem: cc.Node[] = [];

    @property({ type: cc.Node })
    fiveElementsItem: cc.Node[] = [];

    private main: Keno;
    private statisticData: StatisticData[] = [];
    private currentOption = 0;

    private readonly indexDictionary = {
        big: 0,
        small: 1,
        even: 0,
        odd: 1,
        gold: 0,
        wood: 1,
        water: 2,
        fire: 3,
        earth: 4
    };

    private readonly dataIndexDictionary = {
        big: 0,
        small: 0,
        even: 1,
        odd: 1,
        gold: 2,
        wood: 2,
        water: 2,
        fire: 2,
        earth: 2
    }

    onLoad() {
        this.node.active = false;
    }

    public init(main: Keno) {
        this.main = main;
        const condition = () => {
            const finishHandler = main.finishHandler as GameBaseFinishHandler;
            return main.currentTimeRemaining < main.config.stopBetTime || main.currentTimeRemaining > main.config.fullTime - finishHandler.getResultAnimationTime();
        }
        this.bigSmallLog.init(condition);
        this.sharedLog.init(condition);
    }

    public onOptionClick(event: cc.Component.EventHandler, game) {
        this.currentOption = this.getIndexOption(event.target.name);
        this.updateDisplay();
    }

    private getIndexOption(name: string): number {
        return name === "chan-le" ? 0 : 1;
    }

    private updateDisplay() {
        this.showBigSmall();

        switch (this.currentOption) {
            case 0:
                this.showEvenOdd();
                break;
            case 1:
                this.showFiveElements();
                break;
        }

        this.options.children.forEach((child, i) => {
            var selected = this.getIndexOption(child.name) == this.currentOption;
            child.children[0].active = !selected;
            child.children[1].color = selected ? cc.color(165, 137, 35) : cc.color(178, 178, 178);
        });
    }

    public setData(data: any) {
        this.node.active = true;

        var results: string[][] = data.map(d => {
            var settlementResult = d.settlementResult;
            return this.main.getResults(settlementResult);
        });

        this.statisticData = [{
            data: [],
            statistic: [0, 0],
        },
        {
            data: [],
            statistic: [0, 0],
        },
        {
            data: [],
            statistic: [0, 0, 0, 0, 0],
        }];

        results.reverse().forEach(result => {
            result.forEach(e => {
                var statistic = this.statisticData[this.dataIndexDictionary[e]];
                statistic.data.push(this.indexDictionary[e]);
                statistic.statistic[this.indexDictionary[e]]++;
            })
        });

        this.updateDisplay();
    }

    private showBigSmall() {
        this.bigSmallLog.items = this.bigSmallItem;
        this.bigSmallProgress.prefixes = ["TÀI", "XỈU"];
        var statisticData = this.statisticData[HistoryOption.BigSmall];
        this.updataStatistic(this.bigSmallProgress, statisticData, this.bigSmallLog);
    }

    private showEvenOdd() {
        this.sharedLog.items = this.evenOddItem;
        this.evenOddProgress.prefixes = ["CHẴN", "LẺ"];
        var statisticData = this.statisticData[HistoryOption.EvenOdd];
        this.updataStatistic(this.evenOddProgress, statisticData, this.sharedLog);

        this.evenOddProgress.node.active = true;
        this.fiveElementProgress.node.active = false;
    }

    private showFiveElements() {
        this.sharedLog.items = this.fiveElementsItem;
        this.fiveElementProgress.prefixes = ["KIM", "MỘC", "THUỶ", "HOẢ", "THỔ"];
        var statisticData = this.statisticData[HistoryOption.FiveElements];

        // data test
        // statisticData.statistic = [1, 10, 78, 10, 1];
        // statisticData.data = statisticData.data.slice(0, 100);
        this.updataStatistic(this.fiveElementProgress, statisticData, this.sharedLog);

        this.evenOddProgress.node.active = false;
        this.fiveElementProgress.node.active = true;
    }

    private updataStatistic(progress: StatisticProgress, statisticData: any, logControl: LogControl) {
        var data = statisticData.data;

        if (data.length > 0) {
            progress.setProgress(statisticData.statistic, data.length);
        } else {
            progress.clear();
        }
        logControl.setData(data);
    }
}
