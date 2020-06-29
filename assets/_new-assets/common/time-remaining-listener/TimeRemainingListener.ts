const { ccclass, property } = cc._decorator;

@ccclass
export default class TimeRemainingListener extends cc.Component {
    @property
    isOldStyle = true;

    private gameName = "";
    private dataKey = "";
    private currentTimeRemaining = 0;

    public callback = {
        getBetTime: () => 30,
        update: (timeRemaining: number) => { }
    }

    sendData(payload: any) {
        const data = this.isOldStyle ? { [this.gameName]: payload } : { g: { [this.gameName]: payload } };
        cc.RedT.send(data);
    }

    init(gameName: string) {
        this.gameName = gameName;
        this.dataKey = `time_remaining_${this.gameName}`;
        this.sendData({ view: true, get_time: true });
        cc.RedT.addDataObserver(this.dataKey, (data) => this.receivedData(data));
    }

    onDestroy() {
        cc.RedT.removeDataObserver(this.dataKey);
    }

    receivedData(data) {
        const dataGame = data[this.gameName];
        if (dataGame) {
            if (dataGame.um) {
                this.currentTimeRemaining = this.callback.getBetTime();
                this.unschedule(this.updateTime);
                this.callback.update(this.currentTimeRemaining);
            } else if (dataGame.remainingTime || dataGame.time_remain) {
                this.currentTimeRemaining = dataGame.remainingTime || dataGame.time_remain;
                this.unschedule(this.updateTime);
                this.playTime();
            }
        }
    }

    playTime() {
        this.updateTime();
        this.schedule(this.updateTime, 1);
    }

    updateTime() {
        this.currentTimeRemaining--;
        this.callback.update(this.currentTimeRemaining);
        if (this.currentTimeRemaining < 0) {
            this.unschedule(this.updateTime);
        }
    }
}
