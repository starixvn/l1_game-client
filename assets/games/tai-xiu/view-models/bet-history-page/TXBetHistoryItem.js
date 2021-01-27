cc.Class({
	extends: cc.Component,
	properties: {
		time: {
			default: null,
			type: cc.Label
		},
		user: {
			default: null,
			type: cc.Label
		},
		cuoc: {
			default: null,
			type: cc.Label
		},
		tralai: {
			default: null,
			type: cc.Label
		},
		highlight: {
			default: null,
			type: cc.Node
		},
	},
	setHighlightText(highlight) {
		var color = highlight ? cc.Color.YELLOW : cc.Color.WHITE;
		this.time.node.color = color;
		this.user.node.color = color;
		this.cuoc.node.color = color;
		this.tralai.node.color = color;
	},
});
