cc.Class({
    extends: cc.Component,

    properties: {
        message: cc.Label
    },

    onLoad() {
        if (window.umInfo) {
            this.message.node.color = cc.Color.BLACK;
            this.message.string = `Hệ thống đang được bảo trì. Thời gian từ ${new Date(umInfo.startTime)} đến ${new Date(umInfo.endTime)}. Vui lòng quay lại sau, cảm ơn Bạn.`;
        }
    }
});
