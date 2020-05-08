const { ccclass, property } = cc._decorator;

@ccclass
export default class LogsControl extends cc.Component {

    @property({ type: cc.Node })
    items: cc.Node[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    @property({ type: cc.Integer })
    max = 6;

    @property(cc.Size)
    itemSize: cc.Size = new cc.Size(22, 22);

    public setData(results: number[]) {
        this.content.children.forEach(child => child.destroy());

        var col = 0, row = 0;
        var previousResult = undefined;

        results.forEach((result, i) => {
            if (previousResult && result == previousResult) {
                row++;
            }

            if (row == this.max) {
                row = 0;
                col++;
            }

            var dot = cc.instantiate(this.items[result]);
            dot.active = true;
            dot.position = cc.v2(col * this.itemSize.width, -row * this.itemSize.height);
            console.log(`dot position ${dot.position.x},  ${dot.position.y}`);
            this.content.addChild(dot);
        });
    }
}
