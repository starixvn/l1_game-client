import Keno from "./Keno";
import LogControl from "./LogControl";
import StatisticProgress from "../../../common/statistic-progress/StatisticProgress";

const { ccclass, property } = cc._decorator;
interface StatisticData {
    data: number[];
    statistic: any;
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

    @property(cc.Node)
    headers: cc.Node = null;

    @property(LogControl)
    logControl: LogControl = null;

    @property(StatisticProgress)
    statisticProgesses: StatisticProgress = null;

    private main: Keno;
    private statisticData: StatisticData[] = [];

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
            case "chan-le":
                index = HistoryOption.EvenOdd;
            case "ngu-hanh":
                index = HistoryOption.FiveElements;
        }

        this.showHeader(index, true);
    }

    private showHeader(index: number, show: boolean) {
        this.headers.children.forEach((child, i) => {
            child.active = i == index ? show : false;
        });
    }

    public setData(data: any) {
        this.node.active = true;

        var results: string[][] = data.map(d => {
            var settlementResult = d.settlementResult;

            var result = [];
            for (var key in Object.keys(settlementResult)) {
                if (settlementResult.key) {
                    result.push(key);
                }
            }
            return result;
        });

        var taixiuData = [];

        var countBig = 0;
        results.reverse().forEach(result => {
            result.forEach(e => {
                switch (e) {
                    case "big":
                    case "small":
                }
            })
            var big = result.indexOf("big") > -1;
            if (big) {
                taixiuData.push(0);
                countBig++;
            } else {
                taixiuData.push(1);
            }

            var even = result.indexOf("even") > -1;
            if (even) {

            } else {

            }
        });


    }

    private showBigSmall() {
        var statisticData = this.statisticData[HistoryOption.BigSmall];
        var data = statisticData.data;
        var count = statisticData.statistic.big;
        if (data.length > 0) {
            this.statisticProgesses.setProgress(count / data.length);
        } else {
            this.statisticProgesses.clear();
        }
        this.logControl.setData(data);
    }

    private showEvenOdd() {
        var statisticData = this.statisticData[HistoryOption.EvenOdd];
        var data = statisticData.data;
        var count = statisticData.statistic.even;
        if (data.length > 0) {
            this.statisticProgesses.setProgress(count / data.length);
        } else {
            this.statisticProgesses.clear();
        }
        this.logControl.setData(data);
    }
}
