const { ccclass, property } = cc._decorator;

@ccclass
export default class SplitLabel extends cc.Component {
    labels: cc.Label[] = [];
    layout: cc.Layout = null;

    onLoad() {
        this.node.children.forEach((child) => {
            this.labels.push(child.getComponent(cc.Label));
        });
        this.layout = this.node.getComponent(cc.Layout);
    }

    cloneLabelInfo(origin: cc.Label) {
        this.labels.forEach((label) => {
            label.font = origin.font;
            label.fontSize = origin.fontSize;
        });
    }

    setString(values: string[]) {
        if (values.length > this.node.childrenCount) {
            this.addMoreLabels(values.length - this.node.childrenCount);
        }
        values.forEach((value, index) => {
            this.labels[index].string = value;
        });
        this.layout.updateLayout();
    }

    private addMoreLabels(count: number) {
        const sample = this.node.children[0];
        for (let i = 0; i < count; i++) {
            const node = cc.instantiate(sample);
            this.node.addChild(node);
            this.labels.push(node.getComponent(cc.Label));
        }
    }

    setHighlight(indices: number[], color: cc.Color) {
        indices.forEach((index) => {
            this.setColor(index, color);
        });
    }

    private setColor(index: number, color: cc.Color) {
        if (index < 0 || index >= this.labels.length) {
            return;
        }
        const node = this.labels[index].node;
        node.color = color;
    }
}
