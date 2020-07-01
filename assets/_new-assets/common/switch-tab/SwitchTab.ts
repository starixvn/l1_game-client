const { ccclass, property } = cc._decorator;

@ccclass
export default class SwitchTab extends cc.Component {

    @property
    maxIdleTime: number = 5;

    @property(cc.Component.EventHandler)
    closeGameEvent: cc.Component.EventHandler = null;

    private worker: Worker = null;
    private timeInterval: number;
    private idleTime: number = 0;

    onLoad() {
        cc.game.off(cc.game.EVENT_HIDE);
        cc.game.off(cc.game.EVENT_SHOW);

        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    private onGameHide() {
        if (!cc.sys.isNative && !this.worker) {
            this.startTimeInterval();
            cc.game.pause();
            this.startWorker();
        }
    }

    private startTimeInterval() {
        this.timeInterval = setInterval(() => {
            this.idleTime++;
            if (this.idleTime >= this.maxIdleTime * 60) {
                this.closeGameEvent.emit([]);
                this.idleTime = 0;
                clearInterval(this.timeInterval);
            }
        }, 1000);
    }

    private startWorker() {
        const blob = new Blob([
            "onmessage = function (g) {var a, b, c, d = Date.now(),e = g.data[0],f = function () { clearTimeout(a); b = Date.now(); c = b - d; d = b; postMessage(c); a = setTimeout(f, e)};a = setTimeout(f, e)};"
        ], { type: 'text/javascript' });
        this.worker = new Worker(URL.createObjectURL(blob));
        this.worker.onmessage = function (event) {
            cc.director.mainLoop();
        }

        this.worker.postMessage([Math.floor(cc.game._frameTime)])
    }

    private onGameShow() {
        cc.game.resume();
        if (!cc.sys.isNative && this.worker) {
            this.idleTime = 0;
            clearInterval(this.timeInterval);
            this.worker.terminate();
            this.worker = null;
        }
    }
}