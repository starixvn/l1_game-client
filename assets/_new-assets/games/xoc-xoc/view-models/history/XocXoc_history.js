import logger from "../../../../common/logger";

let Helper = require("Helper");
const sentryLogger = logger();

cc.Class({
    extends: cc.Component,

    properties: {
        page: cc.Prefab,
        content: cc.Node,
        iconRed: cc.SpriteFrame,
        iconWhite: cc.SpriteFrame,
    },

    init(socket) {
        this.socket = socket;
    },

    onLoad() {
        let page = cc.instantiate(this.page);
        page.y = -263;
        this.node.addChild(page);
        this.page = page.getComponent("Pagination");
        Promise.all(
            this.content.children.map(function (obj) {
                return obj.getComponent("XocXoc_history_item");
            })
        )
            .then((tab) => {
                this.content = tab;
            })
            .catch((error) => {
                sentryLogger.logError(error);
            });

        this.page.init(this);
    },
    onEnable: function () {
        this.get_data();
    },
    get_data: function (page = 1) {
        this.socket.emit('getHistory', { page: page });
    },
    onData: function (data) {
        let self = this;
        this.page.onSet(data.page, data.pageSize, data.total);

        Promise.all(
            this.content.map(function (obj, i) {
                let dataT = data.data[i];
                if (void 0 !== dataT) {
                    obj.node.active = true;

                    obj.bg.active = i % 2;

                    obj.time.string = Helper.getStringDateByTime(dataT.time);
                    obj.phien.string = dataT.phien;

                    let numb = 0;
                    dataT.kq.forEach(function (dot) {
                        if (dot) {
                            numb++;
                        }
                    });

                    if (!(numb % 2)) {
                        obj.kqSprite.spriteFrame = self.iconWhite;
                        obj.kqLabel.node.color = cc.Color.BLACK;
                    } else {
                        obj.kqSprite.spriteFrame = self.iconRed;
                        obj.kqLabel.node.color = cc.Color.WHITE;
                    }
                    obj.kqLabel.string = numb;

                    obj.chan.string = Helper.numberWithCommas(dataT.chan);
                    obj.le.string = Helper.numberWithCommas(dataT.le);
                    obj.red3.string = Helper.numberWithCommas(dataT.red3);
                    obj.red4.string = Helper.numberWithCommas(dataT.red4);
                    obj.white3.string = Helper.numberWithCommas(dataT.white3);
                    obj.white4.string = Helper.numberWithCommas(dataT.white4);
                    obj.win.string = Helper.numberWithCommas(dataT.betwin);

                    if (!(numb % 2)) {
                        obj.chan.node.color = cc.Color.YELLOW;
                        obj.le.node.color = cc.Color.WHITE;
                    } else {
                        obj.le.node.color = cc.Color.YELLOW;
                        obj.chan.node.color = cc.Color.WHITE;
                    }

                    if (numb === 0) {
                        obj.white4.node.color = cc.Color.YELLOW;
                    } else {
                        obj.white4.node.color = cc.Color.WHITE;
                    }
                    if (numb === 1) {
                        obj.white3.node.color = cc.Color.YELLOW;
                    } else {
                        obj.white3.node.color = cc.Color.WHITE;
                    }
                    if (numb === 3) {
                        obj.red3.node.color = cc.Color.YELLOW;
                    } else {
                        obj.red3.node.color = cc.Color.WHITE;
                    }
                    if (numb === 4) {
                        obj.red4.node.color = cc.Color.YELLOW;
                    } else {
                        obj.red4.node.color = cc.Color.WHITE;
                    }
                } else {
                    obj.node.active = false;
                }
            })
        ).catch((error) => {
            sentryLogger.logError(error);
        });
    },

    closeDialog: function () {
        this.node.destroy();
    },
});
