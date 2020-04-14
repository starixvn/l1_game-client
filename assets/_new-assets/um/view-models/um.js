cc.Class({
    extends: cc.Component,

    properties: {
        message: cc.Label
    },

    onLoad() {
        if (window.umInfo) {
            if (this) {
                const template = 'hh:mm dd/MM/yyyy';
                const startTime = this.formatDate(new Date(umInfo.startTime), template);
                const endTime = this.formatDate(new Date(umInfo.endTime), template);

                this.message.string = `Thời gian bảo trì từ ${startTime} đến ${endTime}.`;
            }
        }
    },

    formatDate(date, template) {
        try {
            var z = {
                M: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds()
            };
            template = template.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
                return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
            });

            return template.replace(/(y+)/g, function (v) {
                return date.getFullYear().toString().slice(-v.length)
            });
        }
        catch (ex) {
            console.log(ex);
            return date.toString();
        }
    }
});
