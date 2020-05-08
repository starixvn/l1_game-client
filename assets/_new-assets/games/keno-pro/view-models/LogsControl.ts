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

            if (row == this.max || result != previousResult) {
                row = 0;
                col++;
            }

            previousResult = result;

            var dot = cc.instantiate(this.items[result]);
            dot.active = true;

            var start = cc.v2(this.itemSize.width / 2, - this.itemSize.height / 2);
            dot.position = cc.v2(start.x + col * this.itemSize.width, start.y - row * this.itemSize.height);
            this.content.addChild(dot);
        });

        this.content.width = Math.max(col * this.itemSize.width, 462);
        this.content.height = this.max * this.itemSize.height;
        console.log(`log length ${results.length}`);
        console.log(`content size ${this.content.width},  ${this.content.height}`);

    }
}
