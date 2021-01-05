import BaseSocketIOController from "../../BaseSocketIOController";

cc.Class({
    extends: cc.Component,

    properties: {
        message: cc.Label
    },

    onLoad() {
        if (window.umInfo) {
            if (this) {
                const template = "hh:mm dd/MM/yyyy";
                const startTime = this.formatDate(this.convertToGMT8(new Date(umInfo.startTime)), template);
                const endTime = this.formatDate(this.convertToGMT8(new Date(umInfo.endTime)), template);

                this.message.string = `Thời gian bảo trì từ ${startTime} đến ${endTime} (GMT+8).`;
            }
        }

        BaseSocketIOController.getInstance().closeAllSocket();
    },

    convertToGMT8(date) {
        return new Date(
            date.toLocaleString("en-US", {
                timeZone: "Asia/Manila"
            })
        );
    },

    formatDate(date, template) {
        try {
            template = template.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
                return ((v.length > 1 ? "0" : "") + eval(`z.${v.slice(-1)}`)).slice(-2);
            });

            return template.replace(/(y+)/g, function (v) {
                return date.getFullYear().toString().slice(-v.length);
            });
        } catch (ex) {
            console.log(ex);
            return date.toString();
        }
    }
});
