cc.Class({
    extends: cc.Component,

    properties: {
        message: cc.Label
    },

    onLoad() {
        if (window.umInfo) {
            this.message.string = window.umInfo.message;
        }
    }
});
