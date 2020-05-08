import Keno from "./Keno";
import LogsControl from "./LogsControl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RoundHistory extends cc.Component {

    @property(cc.Node)
    options: cc.Node = null;

    @property(cc.Node)
    headers: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(LogsControl)
    taixiuLogs: LogsControl = null;

    private main: Keno;

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
                index = 0;
            case "chan-le":
                index = 1;
            case "ngu-hanh":
                index = 2;
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
            var numbers = d.result;
            return this.main.getResults(numbers);
        });

        var taixiuData = [];

        results.reverse().forEach(result => {
            taixiuData.push(result.indexOf("big") > -1 ? 0 : 1);
        });

        this.taixiuLogs.setData(taixiuData);
    }
}
