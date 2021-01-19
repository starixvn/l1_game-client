import { getStringDateByTime, getStringHourByTime } from "../../../../common/helpers/DateTimeHelper";
import { shortenName } from "../../../../common/helpers/NicknameHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";

var TXBetHistory = require("TXBetHistory");

cc.Class({
    extends: TXBetHistory,

    getPhien: function (phien = null) {
        if (!!phien) {
            cc.RedT.inGame.loading.active = true;
            cc.RedT.send({ taixiu_turbo: { get_phien: { red: this.RedT.TX_Main.red, taixiu: this.RedT.TX_Main.taixiu, phien: phien } } });
        }
    },

    onData: function (data) {
        var self = this;
        this.setNew();
        cc.RedT.inGame.loading.active = false;
        this.leftCuoc.string = numberWithCommas(data.tong_L);
        this.rightCuoc.string = numberWithCommas(data.tong_R);
        this.leftTraLai.string = numberWithCommas(data.tong_tralai_L);
        this.rightTraLai.string = numberWithCommas(data.tong_tralai_R);
        this.phien.string = `${data.phien}  -  ${getStringDateByTime(data.time)}`;
        this.isPhien = data.phien;
        var total = data.dice[0] + data.dice[1] + data.dice[2];
        var phienT = cc.RedT.setting.taixiu_turbo.logs[0].phien - data.phien;
        if (phienT < 1) {
            this.nodeNext.active = false;
        } else {
            this.nodeNext.active = true;
        }

        Promise.all(
            this.dice.map(function (dice, index) {
                var point = data.dice[index];
                dice.spriteFrame = self.RedT.TX_Main.diceSF[point - 1];
            })
        );
        if (this.RedT.TX_Main.taixiu) {
            if (total > 10) {
                this.nodeTai.color = cc.Color.WHITE;
                this.nodeXiu.color = this.nodeTai.color.fromHEX("#ACACAC");
                this.nodeTai.opacity = 255;
                this.nodeXiu.opacity = 100;
            } else {
                this.nodeTai.color = this.nodeTai.color.fromHEX("#ACACAC");
                this.nodeXiu.color = cc.Color.WHITE;
                this.nodeTai.opacity = 100;
                this.nodeXiu.opacity = 255;
            }
        } else {
            if (total % 2) {
                this.nodeChan.color = this.nodeChan.color.fromHEX("#ACACAC");
                this.nodeLe.color = cc.Color.WHITE;
                this.nodeChan.opacity = 100;
                this.nodeLe.opacity = 255;
            } else {
                this.nodeChan.color = cc.Color.WHITE;
                this.nodeLe.color = this.nodeChan.color.fromHEX("#ACACAC");
                this.nodeChan.opacity = 255;
                this.nodeLe.opacity = 100;
            }
        }
        Promise.all(
            data.dataL.map(function (obj) {
                var item = self.addItem(obj);
                self.scrollViewLeft.content.addChild(item);
            })
        );
        Promise.all(
            data.dataR.map(function (obj) {
                var item = self.addItem(obj);
                self.scrollViewRight.content.addChild(item);
            })
        );
    },
    addItem: function (obj) {
        var item = cc.instantiate(this.itemPrefab);
        var itemComponent = item.getComponent("TXBetHistoryItem");
        itemComponent.time.string = getStringHourByTime(obj.time);
        var isLoginUser = obj.name === cc.RedT.user.name;
        itemComponent.highlight.active = isLoginUser;
        itemComponent.user.string = isLoginUser ? obj.name : shortenName(obj.name);
        itemComponent.cuoc.string = numberWithCommas(obj.bet);
        itemComponent.tralai.string = numberWithCommas(obj.tralai);
        return item;
    }
});
