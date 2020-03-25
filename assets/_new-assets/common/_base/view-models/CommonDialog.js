cc.Class({
	extends: cc.Component,

	properties: {
	},

	closeDialog: function () {
		this.node.destroy();
	},
});
