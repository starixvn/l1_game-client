cc.Class({
	extends: cc.Component,
	properties: {
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
	showSignName: function () {
		if (!this.signName) {
			const node = cc.instantiate(this.signNamePrefab);
			this.node.addChild(node);
			this.signName = node.getComponent("SignName");
		}
		this.node.active = this.signName.node.active = true;
		this.currentDialog = this.signName.dialogNode.getComponent("CommonDialog");
		this.currentDialog.onDidHide = () => this.node.active = false;
	}
});
