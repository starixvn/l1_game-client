
var helper = require('Helper');

cc.Class({
	extends: cc.Component,
	properties: {
		prefabItem: cc.Prefab,
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
		console.log(limitLeft);
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
		if (void 0 !== data.a) {
			this.NewsAddArray(data.a)
		}

		if (void 0 !== data.t) {
			this.NewsAddText(data.t)
		}
	},
	NewsAddArray: function (arr) {
		var self = this;
		Promise.all(arr.map(function (text) {
			var item = cc.instantiate(self.prefabItem);
			item = item.getComponent('NewsItem');

			item.users.string = text.users;
			item.bet.string = helper.numberWithCommas(text.bet);
			item.game.string = text.game;

			self.AddNewsNode(item.node);
			return item;
		})).then(result => {
			if (!this.node.active) {
				this.setNews()
			}
		})
	},
	NewsAddText: function (text) {
		var item = cc.instantiate(this.prefabItem);
		item = item.getComponent('NewsItem');

		if (!!text.status) {
			item.status.node.active = true;
			if (text.status == 1) {
				item.status.string = "(Nổ Hũ)";
				item.win.string = "nổ hũ";
			} else {
				item.status.string = "(Thắng Lớn)";
			}
		}
		item.users.string = text.users;
		item.bet.string = helper.numberWithCommas(text.bet);
		item.game.string = text.game;

		this.AddNewsNode(item.node);

		if (!this.node.active) {
			this.setNews()
		}
	},

	AddNewsNode(node) {
		var count = this.node.childrenCount;
		var lastItemX = this.node.parent.width / 2 + 200;

		if (count > 0) {
			var lastNode = this.node.children[count - 1];
			lastItemX = Math.max(lastNode.position.x + 450, lastItemX);
		}
		node.position = cc.v2(lastItemX, 0);
		this.node.addChild(node);
	}
});
