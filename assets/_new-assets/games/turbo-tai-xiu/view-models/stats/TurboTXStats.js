var TXStats = require("TXStats");
cc.Class({
	extends: TXStats,

	init(obj) {
		this.TXRoot = obj;

		if (void 0 !== cc.RedT.setting.taixiu_turbo.tk_position) {
			this.node.position = cc.RedT.setting.taixiu_turbo.tk_position;
		}

		if (void 0 !== cc.RedT.setting.taixiu_turbo.tk_active) {
			this.node.active = cc.RedT.setting.taixiu_turbo.tk_active;
		}

		//KetQuaDot
		this.KetQuaDot = this.KetQuaDot.children.map(function (obj) {
			return obj.getComponent(cc.Sprite);
		});

		//DiemSoCel
		var DiemSoCel = Promise.all(this.DiemSoCel.children.map(function (cel) {
			cel.RedT = Promise.all(cel.children.map(function (obj) {
				obj.text = obj.children[0].getComponent(cc.Label);
				return obj;
			}));
			cel.RedT.then(function (value) {
				cel.RedT = value;
			})
			return cel;
		}))
			.then(result => {
				this.DiemSoCel = result;
			});

		//dice1_dot
		var dice1 = Promise.all(this.dice1_dot.children.map(function (dot) {
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
			.then(result => {
				this.dice1_dots = result;
			});

		//dice2_dot
		var dice2 = Promise.all(this.dice2_dot.children.map(function (dot) {
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
			.then(result => {
				this.dice2_dots = result;
			});

		//dice3_dot
		var dice3 = Promise.all(this.dice3_dot.children.map(function (dot) {
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
			.then(result => {
				this.dice3_dots = result;
			});

		//tong_dot
		var tong_dot = Promise.all(this.tong_dot.children.map(function (dot) {
			dot.text = dot.children[0].getComponent(cc.Label);
			return dot;
		}))
			.then(result => {
				this.tong_dots = result;
			});

		var self = this;
		Promise.all([DiemSoCel, dice1, dice2, dice3, tong_dot])
			.then(() => {
				self.TXRoot.TX_Main.updateTXStats();
			});
	},
	eventEnd: function () {
		cc.RedT.setting.taixiu_turbo.tk_position = this.node.position;
	},
});
