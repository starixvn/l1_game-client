
var helper = require('Helper');
var TXChat = require('TXChat');

cc.Class({
	extends: TXChat,

	init(obj) {
		this.RedT = obj;
		if (void 0 !== cc.RedT.setting.taixiu_turbo.chat_active) {
			this.node.active = cc.RedT.setting.taixiu_turbo.chat_active;
		}
	},

	getData: function () {
		this.isLoad = true;
		cc.RedT.send({ taixiu_turbo: { getLogChat: true } });
	},

	onChatClick: function () {
		if (helper.isEmpty(this.input.string)) {
			this.RedT.onData({ err: "Nhập nội dung để chat..." });
		} else {
			cc.RedT.send({ taixiu_turbo: { chat: this.input.string } });
			this.onData({ message: { user: cc.RedT.user.name, value: this.input.string } });
			this.clean();
		}
	},
});
