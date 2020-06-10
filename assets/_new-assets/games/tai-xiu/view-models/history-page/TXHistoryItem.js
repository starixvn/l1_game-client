
cc.Class({
    extends: cc.Component,
    properties: {
        time: {
            default: null,
            type: cc.Label
        },
        phien: {
            default: null,
            type: cc.Label
        },
        dat: {
            default: null,
            type: cc.Label
        },
        ketqua: {
            default: null,
            type: cc.Label
        },
        cuoc: {
            default: null,
            type: cc.Label
        },
        win: {
            default: null,
            type: cc.Label
        },
        tralai: {
            default: null,
            type: cc.Label
        },
    },
    onRoundIdClick: function () {
        cc.RedT.audio.playClick();
        this.roundIdClick();
    }
});
