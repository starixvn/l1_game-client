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

    @property(cc.Node)
    headers: cc.Node = null;

    @property(LogControl)
    logControl: LogControl = null;

    @property(StatisticProgress)
    statisticProgesses: StatisticProgress = null;

    @property({ type: cc.Node })
    bigSmallItem: cc.Node[] = [];

    @property({ type: cc.Node })
    evenOddItem: cc.Node[] = [];

    @property({ type: cc.Node })
    fiveElementsItem: cc.Node[] = [];

    private main: Keno;
    private statisticData: StatisticData[] = [];
    private currentOption = 0;


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
        console.log("option click ", this.currentOption);
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
        this.showHeader(this.currentOption, true);
    }

    private showHeader(index: number, show: boolean) {
        // this.headers.children.forEach((child, i) => {
        //     child.active = i == index ? show : false;
        // });
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
                var bigSmall = this.statisticData[HistoryOption.BigSmall];
                var evenOdd = this.statisticData[HistoryOption.EvenOdd];
                switch (e) {
                    case "big":
                        bigSmall.data.push(0);
                        bigSmall.statistic[0]++;
                        break;
                    case "small":
                        bigSmall.data.push(1);
                        bigSmall.statistic[1]++;
                        break;
                    case "even":
                        evenOdd.data.push(0);
                        evenOdd.statistic[0]++;
                        break;
                    case "odd":
                        evenOdd.data.push(1);
                        evenOdd.statistic[1]++;
                        break;
                }
            })
        });

        this.updateDisplay();
    }

    private showBigSmall() {
        this.logControl.items = this.bigSmallItem;
        this.statisticProgesses.left = "TÀI";
        this.statisticProgesses.right = "XỈU";

        var statisticData = this.statisticData[HistoryOption.BigSmall];
        var data = statisticData.data;
        var count = statisticData.statistic[0];
        if (data.length > 0) {
            this.statisticProgesses.setProgress(count / data.length);
        } else {
            this.statisticProgesses.clear();
        }
        this.logControl.setData(data);
    }

    private showEvenOdd() {
        this.logControl.items = this.evenOddItem;
        this.statisticProgesses.left = "CHẴN";
        this.statisticProgesses.right = "LẺ";

        var statisticData = this.statisticData[HistoryOption.EvenOdd];
        var data = statisticData.data;
        var count = statisticData.statistic[0];
        if (data.length > 0) {
            this.statisticProgesses.setProgress(count / data.length);
        } else {
            this.statisticProgesses.clear();
        }
        this.logControl.setData(data);
    }

    private showFiveElements() {
        // this.logControl.items = this.evenOddItem;
        // this.statisticProgesses.left = "CHẴN";
        // this.statisticProgesses.right = "LẺ";

        // var statisticData = this.statisticData[HistoryOption.EvenOdd];
        // var data = statisticData.data;
        // var count = statisticData.statistic[0];
        // if (data.length > 0) {
        //     this.statisticProgesses.setProgress(count / data.length);
        // } else {
        //     this.statisticProgesses.clear();
        // }
        // this.logControl.setData(data);
    }
}
