
var TXBetHistory = require("TXBetHistory");
var helper = require('Helper');

cc.Class({
	extends: TXBetHistory,

	getPhien: function (phien = null) {
		if (!!phien) {
			cc.RedT.inGame.loading.active = true;
			cc.RedT.send({ taixiu_turbo: { get_phien: { red: this.RedT.TX_Main.red, taixiu: this.RedT.TX_Main.taixiu, phien: phien } } });
		}
	},

	onData: function (data) {
		var self = this;
		this.setNew();
		cc.RedT.inGame.loading.active = false;
		this.leftCuoc.string = helper.numberWithCommas(data.tong_L);
		this.rightCuoc.string = helper.numberWithCommas(data.tong_R);
		this.leftTraLai.string = helper.numberWithCommas(data.tong_tralai_L);
		this.rightTraLai.string = helper.numberWithCommas(data.tong_tralai_R);
		this.phien.string = data.phien + '  -  ' + helper.getStringDateByTime(data.time);
		this.isPhien = data.phien;
		var total = data.dice[0] + data.dice[1] + data.dice[2];
		var phienT = cc.RedT.setting.taixiu_turbo.logs[0].phien - data.phien;
		// if (phienT > 17) {
		// 	this.nodePrevious.active = false;
		// } else {
		// 	this.nodePrevious.active = true;
		// }
		if (phienT < 1) {
			this.nodeNext.active = false;
		} else {
			this.nodeNext.active = true;
		}

		Promise.all(this.dice.map(function (dice, index) {
			var point = data.dice[index];
			dice.spriteFrame = self.RedT.TX_Main.diceSF[point - 1];
		}));
		if (this.RedT.TX_Main.taixiu) {
			this.nodeTai.color = total > 10 ? cc.Color.WHITE : this.nodeTai.color.fromHEX('#ACACAC');
			this.nodeXiu.color = total > 10 ? this.nodeTai.color.fromHEX('#ACACAC') : cc.Color.WHITE;
			this.nodeTai.opacity = total > 10 ? 255 : 100;
			this.nodeXiu.opacity = total > 10 ? 100 : 255;
		} else {
			this.nodeChan.color = total % 2 ? this.nodeChan.color.fromHEX('#ACACAC') : cc.Color.WHITE;
			this.nodeLe.color = total % 2 ? cc.Color.WHITE : this.nodeChan.color.fromHEX('#ACACAC');
			this.nodeChan.opacity = total % 2 ? 100 : 255;
			this.nodeLe.opacity = total % 2 ? 255 : 100;
		}
		Promise.all(data.dataL.map(function (obj) {
			var item = self.addItem(obj);
			self.scrollViewLeft.content.addChild(item);
		}))
		Promise.all(data.dataR.map(function (obj) {
			var item = self.addItem(obj);
			self.scrollViewRight.content.addChild(item);
		}))
	},
	addItem: function (obj) {
		var item = cc.instantiate(this.itemPrefab);
		var itemComponent = item.getComponent('TXBetHistoryItem');
		itemComponent.time.string = helper.getStringHourByTime(obj.time);
		var isLoginUser = obj.name == cc.RedT.user.name;
		itemComponent.highlight.active = isLoginUser;
		itemComponent.user.string = isLoginUser ? obj.name : helper.shortenName(obj.name);
		itemComponent.cuoc.string = helper.numberWithCommas(obj.bet);
		itemComponent.tralai.string = helper.numberWithCommas(obj.tralai);
		return item;
	},
});
