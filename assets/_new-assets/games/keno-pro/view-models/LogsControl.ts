const { ccclass, property } = cc._decorator;

@ccclass
export default class LogsControl extends cc.Component {

    @property({ type: cc.Node })
    items: cc.Node[] = [];

    @property(cc.Node)
    content: cc.Node = null;

    @property({ type: cc.Integer })
    RowMax = 6;

    @property(cc.Size)
    itemSize: cc.Size = new cc.Size(22, 22);

    @property(cc.Size)
    padding: cc.Size = new cc.Size(2, 2);

    public setData(results: number[]) {
        this.content.children.forEach(child => child.destroy());

        var col = 0, row = 0;
        var previousResult = undefined;

        var start = cc.v2(-this.itemSize.width / 2 + this.padding.width / 2, - this.itemSize.height / 2 - this.padding.height);
        results.forEach((result, i) => {
            if (result == previousResult) {
                row++;
            }

            if (row == this.RowMax || result != previousResult) {
                row = 0;
                col++;
            }

            previousResult = result;

            var dot = cc.instantiate(this.items[result]);
            dot.active = true;

            dot.position = cc.v2(start.x + col * this.itemSize.width, start.y - row * this.itemSize.height);
            this.content.addChild(dot);
        });

        this.content.width = Math.max(col * this.itemSize.width, this.node.width) + this.padding.width;
        this.content.height = this.RowMax * this.itemSize.height + this.padding.height;

        this.content.position = cc.v2(-this.content.width, this.content.position.y);
    }
}
