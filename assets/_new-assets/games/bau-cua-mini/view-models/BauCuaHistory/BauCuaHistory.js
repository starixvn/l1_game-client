
var helper = require('Helper');
var Pagination = require("Pagination");

cc.Class({
	extends: cc.Component,
	properties: {
		pages: {
			default: null,
			type: Pagination
		},
		content: cc.Node,
		cointRed: cc.Node,
		cointXu: cc.Node,
		red: true,
		mainFrame: {
			default: null,
			type: cc.Node
		}
	},
	init(obj) {
		this.RedT = obj;
	},
	onLoad() {
		this.pages.init(this);

		this.content = this.content.children.map(function (obj) {
			return obj.getComponent('BauCuaHistoryItem');
		})

		const commonDialog = this.mainFrame.getComponent('CommonDialog');
		commonDialog.onDidHide = () => { this.node.destroy(); };
	},
	onEnable: function () {
		this.get_data();
	},
	get_data: function (page = 1) {
		cc.RedT.send({ g: { baucua: { viewlogs: { red: this.red, page: page } } } });
	},
	changerCoint: function () {
		this.red = !this.red;
		this.cointRed.active = !this.cointRed.active;
		this.cointXu.active = !this.cointXu.active;
		this.get_data();
	},
	onData: function (data) {
		var self = this;
		this.pages.onSet(data.page, data.kmess, data.total);
		this.content.forEach(function (obj, i) {
			var dataT = data.data[i]
			if (void 0 !== dataT) {
				obj.node.active = true
				obj.time.string = helper.getStringDateByTime(dataT.time);
				obj.phien.string = dataT.phien;
				obj.thang.string = helper.numberWithCommas(dataT.betwin);
				obj.thang.node.color = dataT.betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
				obj.kq.forEach(function (kq, j) {
					kq.spriteFrame = self.RedT.iconMini[dataT.kq[j]];
				});

				obj.datLabel.forEach(function (cuoc, k) {
					if (dataT[k] > 0) {
						cuoc.node.parent.active = true;
						cuoc.string = helper.numberWithCommas(dataT[k]);
					} else {
						cuoc.node.parent.active = false;
					}
				})
			} else {
				obj.node.active = false
			}
		})
	}
});
