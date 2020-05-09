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

    public setProgress(values: number[], total: number) {
        for (var i = 0; i < this.labels.length; i++) {
            var value = Math.round(values[i] * 100 / total);
            this.labels[i].string = `${this.prefixes[i]} ${value}${this.suffix}`;
            this.labels[i].node.active = true;

            this.frames[i].width = values[i] / total * this.node.width;
        }
    }

    public clear() {
        for (var i = 0; i < this.labels.length; i++) {
            this.labels[i].node.active = false;
        }
    }
}
