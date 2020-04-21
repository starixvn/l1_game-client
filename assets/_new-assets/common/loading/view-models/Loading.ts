const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Label)
    percent: cc.Label = null;

    onEnable() {
        var self = this;
        self.percent.node.active = true;
        cc.loader.onProgress = function (completedCount, totalCount, item) {
            var percent = 100 * completedCount / totalCount;
            if (self.percent && percent) {
                self.percent.string = percent.toFixed(0) + "%";
            }
        };
    }
    onDisable() {
        this.percent.string = '';
    }

    onData(data: any) {
        if (void 0 !== data.active) {
            this.node.active = data.active;
        }
        if (void 0 !== data.text) {
            this.percent.string = data.text;
        }
    }
}
