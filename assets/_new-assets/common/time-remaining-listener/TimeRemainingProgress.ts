import TimeRemainingListener from "./TimeRemainingListener";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TimeRemainingProgress extends cc.Component {
    @property
    gameName: string = "";

    @property
    betTime: number = 0;

    @property(cc.Label)
    label: cc.Label = null;

    @property(TimeRemainingListener)
    listener: TimeRemainingListener = null;

    private callback = {
        getBetTime: () => this.betTime,
        update: (timeRemaining: number) => {
            this.label.node.parent.active = timeRemaining > 0;
            this.label.string = timeRemaining.toString();
        }
    }

    start() {
        this.label.node.parent.active = false;
        this.listener.init(this.gameName);
        this.listener.callback = this.callback;
    }
}
