cc.Class({
    extends: cc.Component,

    properties: {},

    closeGuide: function () {
        this.node.destroy();
    },
});
