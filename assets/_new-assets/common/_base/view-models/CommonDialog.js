cc.Class({
	extends: cc.Component,

	properties: {
	},

	closeDialog: function () {
		cc.RedT.audio.playUnClick();
		this.node.destroy();
	},
});
