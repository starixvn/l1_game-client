import LogControl from "../../keno-pro/view-models/LogControl";
import SedieRoundHistoryItem from "./SedieRoundHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieRoundHistory extends cc.Component {

    @property(LogControl)
    logControl: LogControl = null;

    @property(cc.Label)
    even: cc.Label = null;

    @property(cc.Label)
    odd: cc.Label = null;

    @property(cc.Label)
    red3: cc.Label = null;

    @property(cc.Label)
    red4: cc.Label = null;

    @property(cc.Label)
    white3: cc.Label = null;

    @property(cc.Label)
    white4: cc.Label = null;

    private suffix: string = "%";

    public setData(data: any) {
        var redData = data.map(d => {
            let count = 0;
            let list = ["red1", "red2", "red3", "red4"];
            list.forEach(i => {
                if (d.result[i]) {
                    count++;
                }
            });
            return count;
        });

        this.updateStatistic(redData);
        let logData = data.map(d => d.settlementResult.even ? 0 : 1);
        this.logControl.setData(logData);
        var items = this.logControl.content.getComponentsInChildren(SedieRoundHistoryItem);
        items.forEach((item, i) => item.setValue(redData[i]));
    }

    public setDataOldStyle(data: any) {
        var redData = data.map(d => {
            let count = 0;
            for (let i = 0; i < 4; i++) {
                if (d.dots[i]) {
                    count++;
                }
            }
            return count;
        });
        this.updateStatistic(redData);

        let logData = redData.map(d => d % 2 === 0 ? 0 : 1);
        this.logControl.setData(logData);
        var items = this.logControl.content.getComponentsInChildren(SedieRoundHistoryItem);
        items.forEach((item, i) => item.setValue(redData[i]));
    }

    private updateStatistic(redData: number[]) {
        let total = redData.length;

        let oddCount = 0, red3Count = 0, red4Count = 0, white3Count = 0, white4Count = 0;
        redData.forEach(i => {
            switch (i) {
                case 0:
                    white4Count++;
                    break;
                case 1:
                    white3Count++;
                    oddCount++;
                    break;
                case 3:
                    red3Count++;
                    oddCount++;
                    break;
                case 4:
                    red4Count++;
                    break;
            }
        });

        let oddValue = Math.round(oddCount * 100 / total);
        this.odd.string = `${oddValue}${this.suffix}`;
        this.even.string = `${100 - oddValue}${this.suffix}`;
        let red3Value = Math.round(red3Count * 100 / total);
        this.red3.string = `${red3Value}${this.suffix}`;
        this.red4.string = `${Math.round(red4Count * 100 / total)}${this.suffix}`;
        this.white3.string = `${oddValue - red3Value}${this.suffix}`;
        this.white4.string = `${Math.round(white4Count * 100 / total)}${this.suffix}`;
    }
}
