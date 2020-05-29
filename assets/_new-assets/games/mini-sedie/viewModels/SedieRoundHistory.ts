import LogControl from "../../keno-pro/view-models/LogControl";
import SedieRoundHistoryItem from "./SedieRoundHistoryItem";
import GameBase from "../../_base/GameBase";

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

    public setData(redData: any) {
        this.updateHistory(redData);
    }

    public init(main: GameBase) {
        this.logControl.init(main);
    }

    private updateHistory(redData: any) {
        let data = [...redData];
        this.updateStatistic(data);
        data.reverse();
        const logData = data.map(d => d % 2 === 0 ? 0 : 1);
        this.logControl.setData(logData);
        const items = this.logControl.content.getComponentsInChildren(SedieRoundHistoryItem);
        items.forEach((item, i) => item.setValue(data[i]));
    }

    private updateStatistic(redData: number[]) {
        const total = redData.length;

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

        const oddValue = Math.round(oddCount * 100 / total);
        this.odd.string = `${oddValue}${this.suffix}`;
        this.even.string = `${100 - oddValue}${this.suffix}`;
        const red3Value = Math.round(red3Count * 100 / total);
        this.red3.string = `${red3Value}${this.suffix}`;
        this.red4.string = `${Math.round(red4Count * 100 / total)}${this.suffix}`;
        this.white3.string = `${oddValue - red3Value}${this.suffix}`;
        this.white4.string = `${Math.round(white4Count * 100 / total)}${this.suffix}`;
    }
}
