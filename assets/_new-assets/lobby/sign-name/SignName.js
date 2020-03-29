
var BrowserUtil = require('BrowserUtil');

cc.Class({
	extends: cc.Component,

	properties: {
		username: {
			default: null,
			type: cc.EditBox,
		},
		errorMessage: {
			default: null,
			type: cc.Label,
		},
	},
	onLoad() {
		var self = this;
		this.keyHandle = function (t) {
			return t.keyCode === cc.macro.KEY.tab ? (self.changeNextFocusEditBox(),
				t.preventDefault && t.preventDefault(),
				!1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onSignNameClick(),
					t.preventDefault && t.preventDefault(),
					!1) : void 0
		};
		
	},
	onEnable: function () {
		cc.sys.isBrowser && this.addEvent();
		this.node.runAction(cc.RedT.inGame.dialog.actionShow);
	},
	onDisable: function () {
		cc.sys.isBrowser && this.removeEvent();
		this.clean();
		cc.RedT.inGame.dialog.resetSizeDialog(this.node);
	},
	addEvent: function () {
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		BrowserUtil.getHTMLElementByEditBox(this.username).addEventListener("keydown", this.keyHandle, !1);
		this.username.node.on('text-changed', this.usernameTextChanged, this);
	},
	removeEvent: function () {
		BrowserUtil.getHTMLElementByEditBox(this.username).removeEventListener("keydown", this.keyHandle, !1)
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
		this.username.node.off('text-changed', this.usernameTextChanged, this);
	},
	onKeyDown: function (event) {
		switch (event.keyCode) {
			case cc.macro.KEY.tab:
				this.isTop() && this.changeNextFocusEditBox();
				break;
			case cc.macro.KEY.enter:
				this.isTop() && this.onSignNameClick();
		}
	},
	changeNextFocusEditBox: function () {
		BrowserUtil.focusEditBox(this.username)
	},
	isTop: function () {
		return !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
	},
	clean: function () {
		this.username.string = '';
	},
	onSignNameClick: function () {
		if (this.validateUsername(this.username.string)) {
			this.errorMessage.string = "Tên Nhân vật từ 3 đến 14 ký tự và không chứa ký tự đặc biệt";
		} else {
			//Ricky: Client SignName
			cc.RedT.send({ signName: this.username.string });
		}

	},

	usernameTextChanged: function(text, sender) {		
		if (this.validateUsername(this.username.string)) {			
			this.errorMessage.string = "Tên Nhân vật từ 3 đến 14 ký tự và không chứa ký tự đặc biệt";
		} else{
			this.errorMessage.string = "";
		}
	},

	validateUsername: function(username)
	{
		return (username.length > 14 || username.length < 3 || username.match(new RegExp("^[a-zA-Z0-9]+$")) === null);
	}
	
});
