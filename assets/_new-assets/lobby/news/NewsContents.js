
var helper = require('Helper');

cc.Class({
	extends: cc.Component,
	properties: {
		prefabItem: cc.Prefab,
		marqueeFont: cc.BitmapFont
	},
	init: function (obj) {
		this.RedT = obj;
	},
	update: function (t) {
		if (this.node.childrenCount === 0) {
			this.reset();
			return;
		}
		var limitLeft = - this.node.parent.width / 4;
		for (var i = 0; i < this.node.childrenCount; i++) {
			var child = this.node.children[i];
			child.position = cc.v2(child.position.x - 100 * t, 0);

			if (child.position.x + child.width < limitLeft) {
				child.destroy();
			}
		}
	},
	setNews: function () {
		this.node.active = true;
	},
	reset: function () {
		this.node.active = false;
	},
	onData: function (data) {
		if (!cc.RedT.GAME_IS_SHOWED) {
			return;
		}

		if (void 0 !== data) {
			this.addMarqueeMessage(data)
		}
	},
	addMarqueeMessage: function (message) {
		let node = new cc.Node;
		node.addComponent(cc.Label);
		let label = node.getComponent(cc.Label);
		label.font = this.marqueeFont;
		label.string = message;
		label.lineHeight = 47;
		label.fontSize = 20;
		this.AddNewsNode(node);

		if (!this.node.active) {
			this.setNews()
		}
	},

	AddNewsNode(node) {
		var count = this.node.childrenCount;
		var lastItemX = this.node.parent.width / 2 + 200;

		if (count > 0) {
			var lastNode = this.node.children[count - 1];
			lastItemX = Math.max(lastNode.position.x + 900, lastItemX);
		}
		node.position = cc.v2(lastItemX, 0);
		this.node.addChild(node);
	}
});
