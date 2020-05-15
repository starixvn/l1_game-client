const { ccclass, property } = cc._decorator;

@ccclass
export default class StatisticProgress extends cc.Component {

    @property({ type: cc.Node })
    frames: cc.Node[] = [];

    @property({ type: cc.Label })
    labels: cc.Label[] = [];

    @property
    prefixes: string[] = ['TÀI', 'XỈU'];

    @property
    suffix: string = '%';

    @property
    dynamic: boolean = true;

    @property
    showPrefix: boolean = false;

    public setProgress(values: number[], total: number) {
        var count = this.frames.length;
        for (var i = 0; i < count; i++) {
            var value = Math.round(values[i] * 100 / total);
            var prefix = this.showPrefix ? `${this.prefixes[i]} ` : ``;
            this.labels[i].string = `${prefix}${value}${this.suffix}`;
            this.labels[i].node.active = true;

            this.frames[i].width = this.dynamic ? values[i] / total * this.node.width : this.node.width / count;
        }
    }

    public clear() {
        var count = this.frames.length;
        for (var i = 0; i < count; i++) {
            this.labels[i].node.active = false;
            this.frames[i].width = this.node.width / count;
        }
    }
}
