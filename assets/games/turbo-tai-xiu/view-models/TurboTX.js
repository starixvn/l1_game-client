var TX = require("TX");
var Constants = require("./main-page/TurboTXConstants");

cc.Class({
    extends: TX,

    init(gameName, obj) {
        this.gameName = gameName;
        this.miniPanel = obj;
        this.presetBetSettingKey = `${Constants.presetBetSettingKey}_${cc.RedT.user.UID}`;
        cc.RedT.setting.taixiu_turbo = cc.RedT.setting.taixiu_turbo || { getLogs: false };
        cc.RedT.setting.taixiu_turbo.getLogs = false;
        this.TX_Main.init(this);
    },
    onGameShow() {
        cc.RedT.send({
            taixiu_turbo: { get_time: true, getLogs: true }
        });
    },
    regEvent: function (show) {
        if (show) {
            cc.RedT.send({
                taixiu_turbo: { view: true, getLogs: true, get_time: true }
            });
        } else {
            cc.RedT.send({
                taixiu_turbo: { view: false }
            });
        }
    },
    onSignIn() {
        if (!this.node.active) {
            return;
        }

        cc.RedT.setting.taixiu_turbo.getLogs = false;
        this.regEvent(true);
    },
    openGame: function (e, taixiu = "1") {
        this.TX_Main.initGame(taixiu === "1");
        this.node.active = 1;
    },
    closeGame: function () {
        cc.RedT.audio.playUnClick();
        this.TX_Main.betBoard.close();
        this.presetBet.forceClose();
        this.node.active = !1;
    }
});
