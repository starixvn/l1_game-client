import LogControl from "../../keno-pro/view-models/LogControl";
import SedieRoundResultItem from "./SedieRoundResultItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieRoundResult extends cc.Component {

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

    public setData(data: any) {
        var redData = data.map(d => {
            let count = 0;
            let list = ["red1", "red2", "red3", "red4"];
            list.forEach(i => {
                if (d[list[i]]) {
                    count++;
                }
            });
            return count;
        });

        this.updateStatistic(redData);
        let logData = data.map(d => d.settlementResult.even ? 0 : 1);
        this.logControl.setData(logData);
        var items = this.logControl.content.getComponentsInChildren(SedieRoundResultItem);
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
        this.odd.string = oddValue.toString();
        this.even.string = (100 - oddValue).toString();
        this.red3.string = Math.round(red3Count * 100 / total).toString();
        this.red4.string = Math.round(red4Count * 100 / total).toString();
        this.white3.string = Math.round(white3Count * 100 / total).toString();
        this.white4.string = Math.round(white4Count * 100 / total).toString();
    }
}
