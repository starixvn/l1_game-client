const configs = require('Configs');

var signIn = require('SignIn'),
	signName = require('SignName');
cc.Class({
	extends: cc.Component,
	properties: {
		signInPrefab: cc.Prefab,
		signNamePrefab: cc.Prefab,
	},
	init: function () {
		this.node.active = false;
	},
	onClickBack: function () {
		cc.RedT.audio.playUnClick();
		this.onBack();
	},
	onBack: function () {
		this.onCloseDialog();
	},
	onCloseDialog: function () {
		if (this.currentDialog != null) {
			this.currentDialog.closeDialog();
		} else {
			this.node.active = false;
		}
	},
	/**
	 * Function Show Dialog
	*/
	showSignIn: function () {
		if (configs.disabledDirectLogin) {
			cc.director.loadScene("sessiontimeout");
		} else {
			this.node.active = true;
			if (!this.signIn) {
				const node = cc.instantiate(this.signInPrefab);
				this.node.addChild(node);
				this.signIn = node.getComponent("SignIn");
			}
			this.signIn.node.active = true;
			this.currentDialog = this.signIn.getComponent("CommonDialog");
			this.currentDialog.onDidHide = () => this.node.active = false;
		}
	},
	showSignName: function () {
		if (!this.signName) {
			const node = cc.instantiate(this.signNamePrefab);
			this.node.addChild(node);
			this.signName = node.getComponent("SignName");
		}
		this.node.active = this.signName.node.active = true;
		this.signIn && (this.signIn.node.active = false);
		this.currentDialog = this.signName.getComponent("CommonDialog");
		this.currentDialog.onDidHide = () => this.node.active = false;
	}
});
