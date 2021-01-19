import { getStringDateByTime, getStringHourByTime } from "../../../../common/helpers/DateTimeHelper";
import { shortenName } from "../../../../common/helpers/NicknameHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: {
            default: null,
            type: cc.Prefab
        },
        dice: {
            default: [],
            type: cc.Sprite
        },
        leftCuoc: {
            default: null,
            type: cc.Label
        },
        leftTraLai: {
            default: null,
            type: cc.Label
        },
        rightCuoc: {
            default: null,
            type: cc.Label
        },
        rightTraLai: {
            default: null,
            type: cc.Label
        },
        phien: {
            default: null,
            type: cc.Label
        },
        nodeTai: {
            default: null,
            type: cc.Node
        },
        nodeXiu: {
            default: null,
            type: cc.Node
        },
        nodeChan: {
            default: null,
            type: cc.Node
        },
        nodeLe: {
            default: null,
            type: cc.Node
        },
        scrollViewLeft: {
            default: null,
            type: cc.ScrollView
        },
        scrollViewRight: {
            default: null,
            type: cc.ScrollView
        },
        nodeNext: {
            default: null,
            type: cc.Node
        },
        nodePrevious: {
            default: null,
            type: cc.Node
        },
        labelGame: {
            default: null,
            type: cc.Label
        },
        nodeRED: {
            default: null,
            type: cc.Node
        },
        nodeXU: {
            default: null,
            type: cc.Node
        },
        mainFrame: {
            default: null,
            type: cc.Node
        }
    },
    onLoad: function () {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    },
    init(obj) {
        this.RedT = obj;
    },
    onChangerGame: function () {
        this.labelGame.string = this.RedT.TX_Main.taixiu ? "Chẵn Lẻ" : "Tài Xỉu";
        this.nodeTai.active = this.RedT.TX_Main.taixiu;
        this.nodeXiu.active = this.RedT.TX_Main.taixiu;
        this.nodeChan.active = !this.RedT.TX_Main.taixiu;
        this.nodeLe.active = !this.RedT.TX_Main.taixiu;
    },
    onChangerCoint: function () {
        this.nodeRED.active = !this.nodeRED.active;
        this.nodeXU.active = !this.nodeXU.active;
    },
    onChangerGameClick: function () {
        this.RedT.TX_Main.onChangerGame();
        this.getPhien(this.isPhien);
    },
    onChangerCointClick: function () {
        this.RedT.TX_Main.onChangerRED();
        this.getPhien(this.isPhien);
    },
    onGetPhienClick: function (event) {
        this.getPhien(event.target.phien);
    },
    getPhien: function (phien = null) {
        if (!!phien) {
            cc.RedT.inGame.loading.active = true;
            cc.RedT.send({ taixiu: { get_phien: { red: this.RedT.TX_Main.red, taixiu: this.RedT.TX_Main.taixiu, phien: phien } } });
        }
    },
    onNextClick: function (event) {
        this.getPhien(this.isPhien + 1);
    },
    onPreviousClick: function (event) {
        this.getPhien(this.isPhien - 1);
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
        var phienT = cc.RedT.setting.taixiu.logs[0].phien - data.phien;

        this.nodeNext.active = phienT >= 1;

        Promise.all(
            this.dice.map(function (dice, index) {
                var point = data.dice[index];
                dice.spriteFrame = self.RedT.TX_Main.diceSF[point - 1];
            })
        );

        this.nodeTai.color = total > 10 ? cc.Color.WHITE : this.nodeTai.color.fromHEX("#ACACAC");
        this.nodeXiu.color = total > 10 ? this.nodeTai.color.fromHEX("#ACACAC") : cc.Color.WHITE;
        this.nodeTai.opacity = total > 10 ? 255 : 100;
        this.nodeXiu.opacity = total > 10 ? 100 : 255;

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
    },
    setNew: function () {
        this.scrollViewLeft.content.destroyAllChildren();
        this.scrollViewRight.content.destroyAllChildren();
    },
    hide: function () {
        this.node.active = false;
    }
});
