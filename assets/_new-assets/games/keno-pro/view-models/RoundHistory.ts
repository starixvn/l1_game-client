import Keno from "./Keno";
import LogControl from "./LogControl";
import StatisticProgress from "../../../common/statistic-progress/StatisticProgress";

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
    logControl: LogControl = null;

    @property(StatisticProgress)
    statisticProgesses: StatisticProgress = null;

    @property(StatisticProgress)
    statisticProgesses2: StatisticProgress = null;

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
    }

    public onOptionClick(event: cc.Component.EventHandler, game) {
        var index = 0;
        switch (event.target.name) {
            case "tai-xiu":
                index = HistoryOption.BigSmall;
                break;
            case "chan-le":
                index = HistoryOption.EvenOdd;
                break;
            case "ngu-hanh":
                index = HistoryOption.FiveElements;
                break;
        }

        this.currentOption = index;
        this.updateDisplay();
    }

    private updateDisplay() {
        switch (this.currentOption) {
            case 0:
                this.showBigSmall();
                break;
            case 1:
                this.showEvenOdd();
                break;
            case 2:
                this.showFiveElements();
                break;
        }

        this.options.children.forEach((child, i) => {
            child.children[0].active = i != this.currentOption;
        });
    }

    public setData(data: any) {
        this.node.active = true;

        var results: string[][] = data.map(d => {
            var settlementResult = d.settlementResult;

            var result = [];
            Object.keys(settlementResult).forEach(key => {
                if (settlementResult[key]) {
                    result.push(key);
                }
            })

            return result;
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
        this.logControl.items = this.bigSmallItem;
        this.statisticProgesses.prefixes = ["TÀI", "XỈU"];
        var statisticData = this.statisticData[HistoryOption.BigSmall];
        this.updataStatistic(this.statisticProgesses, statisticData);

        this.statisticProgesses.node.active = true;
        this.statisticProgesses2.node.active = false;
    }

    private showEvenOdd() {
        this.logControl.items = this.evenOddItem;
        this.statisticProgesses.prefixes = ["CHẴN", "LẺ"];
        var statisticData = this.statisticData[HistoryOption.EvenOdd];
        this.updataStatistic(this.statisticProgesses, statisticData);

        this.statisticProgesses.node.active = true;
        this.statisticProgesses2.node.active = false;
    }

    private showFiveElements() {
        this.logControl.items = this.fiveElementsItem;
        this.statisticProgesses2.prefixes = ["KIM", "MỘC", "THUỶ", "HOẢ", "THỔ"];
        var statisticData = this.statisticData[HistoryOption.FiveElements];
        this.updataStatistic(this.statisticProgesses2, statisticData);

        this.statisticProgesses.node.active = false;
        this.statisticProgesses2.node.active = true;
    }

    private updataStatistic(progress: StatisticProgress, statisticData: any) {
        var data = statisticData.data;

        if (data.length > 0) {
            progress.setProgress(statisticData.statistic, data.length);
        } else {
            progress.clear();
        }
        this.logControl.setData(data);
    }
}
