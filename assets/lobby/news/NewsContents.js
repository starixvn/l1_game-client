cc.Class({
    extends: cc.Component,
    properties: {
        prefabItem: cc.Prefab,
        marqueeFont: cc.BitmapFont
    },
    init: function (obj) {
        this.RedT = obj;
        this.colors = ["#F24647", "#33D3E9", "#F8E49D"];
    },
    update: function (t) {
        if (this.node.childrenCount === 0) {
            this.reset();
            return;
        }
        var limitLeft = -this.node.parent.width / 4;
        for (var i = 0; i < this.node.childrenCount; i++) {
            var child = this.node.children[i];
            child.position = cc.v2(child.position.x - 100 * t, 0);

            if (child.position.x + child.width < limitLeft) {
                child.destroy();
            }
        }
    },
    reset: function () {
        this.node.active = false;
    },
    onData: function (data) {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }

        if (void 0 !== data) {
            this.addMarqueeMessage(data);
        }
    },
    addMarqueeMessage: function (message) {
        const node = new cc.Node();
        node.color = node.color.fromHEX(this.colors[Math.floor(Math.random() * 3)]);
        node.addComponent(cc.Label);
        const label = node.getComponent(cc.Label);
        label.font = this.marqueeFont;
        label.string = message;
        label.lineHeight = 47;
        label.verticalAlign = "top";
        label.fontSize = 16;
        this.addNewsNode(node);
        this.node.active = true;
    },

    addNewsNode(node) {
        var count = this.node.childrenCount;
        var lastItemX = this.node.parent.width / 2 + node.width / 2;
        var lastNode = this.node.children[count - 1];

        this.node.addChild(node);
        if (lastNode) {
            lastItemX = Math.max(lastNode.position.x + lastNode.width / 2 + node.width / 2 + 100, lastItemX);
        }
        node.position = cc.v2(lastItemX, 0);
    }
});
