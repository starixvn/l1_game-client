import { numberPad, numberWithCommas } from './../../../common/helpers/NumberHelper';

const BauCuaLinhVat = require("BauCuaMascot");
const BCConstants = require("BCConstants");

cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,
        linhVat: {
            default: [],
            type: BauCuaLinhVat
        },

        iconMini: {
            default: [],
            type: cc.SpriteFrame
        },

        iconLV: {
            default: [],
            type: cc.SpriteFrame
        },

        dices: {
            default: [],
            type: cc.Sprite
        },

        // chipSprites: {
        //     default: [],
        //     type: cc.SpriteFrame
        // },

        logHuou: cc.Label,
        logBau: cc.Label,
        logGa: cc.Label,
        logCa: cc.Label,
        logCua: cc.Label,
        logTom: cc.Label,
        phienLabel: cc.Label,
        userCountLabel: cc.Label,
        animatedTime: cc.Component,
        waitedTime: cc.Label,

        Animation: cc.Animation,

        logNode: cc.Node,
        logs: cc.Node,
        prefabLogs: cc.Prefab,

        notice: cc.Node,
        umWarning: cc.Node,
        umWarningMessage: cc.Label,
        processWarningPrefab: cc.Prefab,
        prefabNotice: cc.Prefab,
        center: cc.Node,

        cuoc: "",
        red: true,
        topDialog: cc.Prefab,
        historyDialog: cc.Prefab,

        oddOne: cc.Label,
        oddTwo: cc.Label,
        oddThree: cc.Label,
        gameAudiosPrefab: {
            default: null,
            type: cc.Prefab
        },
        guidePrefab: cc.Prefab,
        betChipsContainer: cc.Node,
        betChipsPrefab: cc.Prefab
    },
    init(gameName, obj) {
        this.gameName = gameName;
        this.miniPanel = obj; // MiniPanel
        this.initSettingBauCua();
        cc.RedT.setting.baucua.regOpen = false; // force get new data when back from other scene
        this.disabled = false;
        this.waitingCuoc = false;
        this.processingWarning = null;
        this.gameAudios = null;
        this.betChips = null;

        var check = cc.sys.localStorage.getItem("bauCua");
        if (check === "true") {
            this.node.active = true;
        }

        if (void 0 !== cc.RedT.setting.baucua.position) {
            this.node.position = cc.RedT.setting.baucua.position;
        }
        if (void 0 !== cc.RedT.setting.baucua.time_remain) {
            cc.RedT.setting.baucua.time_remain++;
            this.nextRealTime();
        }
        if (cc.RedT.IS_LOGIN) {
            this.dataHandling(cc.RedT.setting.baucua.data);
            if (this.red !== cc.RedT.setting.baucua.red) {
                this.changerCoint();
            }

            if (void 0 !== cc.RedT.setting.baucua.logs) {
                this.addLogs();
            }
        }

        this.betChipList = [];
        this.localPhien = "";
        this.localResultDices = [];
    },
    initSettingBauCua() {
        cc.RedT.setting.baucua = cc.RedT.setting.baucua || {
            regOpen: false,
            data: {
                meRedBau: 0,
                meRedCa: 0,
                meRedCua: 0,
                meRedGa: 0,
                meRedHuou: 0,
                meRedTom: 0,
                redBau: 0,
                redCa: 0,
                redCua: 0,
                redGa: 0,
                redHuou: 0,
                redTom: 0
            },
            logLV: {},
            red: true,
            bet: "1"
        };
    },
    onGameShow() {
        var data = {
            g: {
                baucua: {
                    regOpen: true
                }
            }
        };
        cc.RedT.send(data);
    },
    onGameHide() {
        this.timeInterval && clearInterval(this.timeInterval);
        this.animatedTime.node.active = false;
        this.waitedTime.node.parent.active = false;
        this.phienLabel.string = "";
        this.hideAllDices();
        this.unSelect();
        this.resetStateAllSlot();
        this.clearCuocAllSlot();
        this.statusTimeout && clearTimeout(this.statusTimeout);
        this.notice.children.forEach((child) => (child.active = false)); //hide all notice
    },
    onSignIn() {
        if (!this.node.active) {
            return;
        }

        //force refresh
        cc.RedT.setting.baucua.regOpen = false;
        this.regEvent(true);
    },
    onDestroy() {
        this.statusTimeout && clearTimeout(this.statusTimeout);
    },
    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }
        this.ttOffset = null;
        this.animatedTime.node.active = false;
        this.animatedTime.setRedTime(BCConstants.stopBetTime);
        this.logNode.active = false;
        this.initGameAudios();
        this.initBetChips();
    },
    initGameAudios: function () {
        var gameAudiosNode = cc.instantiate(this.gameAudiosPrefab);
        this.gameAudios = gameAudiosNode.getComponent("GameAudios");
    },
    onEnable: function () {
        this.Animation.on("finished", this.addLogs, this);
        this.regEvent(true);
        this.background.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.background.on(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.background.on(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.background.on(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
        this.logNode.active = cc.RedT.setting.baucua.logs && cc.RedT.setting.baucua.logs.length > 0;
        this.observeData();
    },
    onDisable: function () {
        this.Animation.off("finished");
        this.onGameHide();
        this.regEvent(false);
        this.background.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
        this.background.off(cc.Node.EventType.TOUCH_MOVE, this.eventMove, this);
        this.background.off(cc.Node.EventType.TOUCH_END, this.eventEnd, this);
        this.background.off(cc.Node.EventType.TOUCH_CANCEL, this.eventEnd, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
        cc.game.off(cc.game.EVENT_HIDE, this.onGameHide, this);
        this.removeDataObserver();
    },

    observeData() {
        cc.RedT.addDataObserver(this.gameName, this.receivedData.bind(this));
    },

    removeDataObserver() {
        cc.RedT.removeDataObserver(this.gameName);
    },

    receivedData(data) {
        const dataMini = data.mini;

        if (!dataMini) {
            return;
        }

        const gameData = data.mini[this.gameName];

        if (gameData) {
            this.onData(gameData);
        }
    },
    regEvent: function (show) {
        if (show) {
            cc.RedT.send({
                g: {
                    baucua: {
                        view: true,
                        regOpen: true,
                        get_odd: true
                    }
                }
            });
        } else {
            cc.RedT.send({
                g: {
                    baucua: {
                        view: false
                    }
                }
            });
        }
    },
    eventStart: function (e) {
        this.setTop();
        this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
    },
    eventMove: function (e) {
        this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
    },
    eventEnd: function () {
        cc.RedT.setting.baucua.position = this.node.position;
    },
    openGame: function () {
        this.node.active = !0;
        if (this.timeInterval === undefined) {
            this.clearCuocAllSlot();
            this.showUMWarning(this.disabled);
        }
        cc.sys.localStorage.setItem("bauCua", true);
    },
    showUMWarning(show) {
        if (this.umWarning) {
            this.umWarning.active = show;
        }
    },
    closeGame: function () {
        cc.RedT.audio.playUnClick();
        this.node.active = !1;
        cc.sys.localStorage.setItem("bauCua", false);
    },
    pressedTopDialog() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.topDialog);
        this.miniPanel.dialog.insertChild(dialog);
        this.Top = dialog.getComponent("BauCuaTop");
        this.Top.init(this);
    },
    pressedShowScoreBoard() {
        cc.RedT.audio.playClick();
        this.logNode.active = !this.logNode.active;
    },
    pressedHistoryDialog() {
        cc.RedT.audio.playClick();

        var dialog = cc.instantiate(this.historyDialog);
        this.miniPanel.dialog.insertChild(dialog);
        this.LichSu = dialog.getComponent("BauCuaHistory");
        this.LichSu.init(this);
    },
    pressedShowGuide() {
        cc.RedT.audio.playClick();
        var dialog = cc.instantiate(this.guidePrefab);
        this.miniPanel.dialog.insertChild(dialog);
    },
    setTop: function () {
        this.node.parent.insertChild(this.node);
    },
    changerCoint: function () {
        this.red = !this.red;
        this.nodeRed.active = !this.nodeRed.active;
        this.nodeXu.active = !this.nodeXu.active;
        cc.RedT.setting.baucua.regOpen && this.dataHandling(cc.RedT.setting.baucua.data);
        cc.RedT.setting.baucua.red = this.red;
    },

    showResultSlots: function (dices) {
        this.showWinSlot(dices);
        var heSo = {};
        for (var i = 0; i < 3; i++) {
            var dataT = dices[i];
            if (void 0 === heSo[dataT]) {
                heSo[dataT] = 1;
            } else {
                heSo[dataT] += 1;
            }
        }
        for (var j = 0; j < 6; j++) {
            if (void 0 !== heSo[j]) {
                this.linhVat[j].Select(heSo[j]);
            }
        }
    },
    showWarningSlowBet(show) {
        if (show) {
            if (this.processingWarning !== null) {
                return;
            }
            var node = cc.instantiate(this.processWarningPrefab);
            node.position = this.center.position;
            this.node.addChild(node);
            this.processingWarning = node.getComponent("ProcessingWarning");
        } else {
            if (this.processingWarning === null) {
                return;
            }
            this.processingWarning.close();
            this.processingWarning = null;
        }
    },
    datCuoc: function (e, linhVat) {
        cc.RedT.audio.playClick();
        if (this.disabled) {
            return;
        }
        if (this.waitingCuoc) {
            this.showWarningSlowBet(true);
            return;
        }

        this.waitingCuoc = true;
        cc.RedT.send({
            g: {
                baucua: {
                    cuoc: {
                        cuoc: this.cuoc,
                        red: this.red,
                        linhVat: linhVat
                    }
                }
            }
        });
    },
    addNotice: function (text) {
        var notice = cc.instantiate(this.prefabNotice);
        var noticeComponent = notice.getComponent("mini_warning");
        noticeComponent.text.string = text;
        this.notice.addChild(notice);
    },
    hideAllDices: function () {
        this.dices.forEach((dice) => {
            dice.node.active = false;
        });
    },
    setDice: function (dices) {
        var self = this;
        dices.forEach(function (dice, index) {
            self.dices[index].spriteFrame = self.iconLV[dice];
            self.dices[index].node.active = true;
        });
    },
    addLogs: function () {
        var self = this;
        this.logs.removeAllChildren();
        var count = Math.min(BCConstants.limitLog, cc.RedT.setting.baucua.logs.length);
        if (count === 0) {
            this.logNode.active = false;
            return;
        }
        this.logNode.active = true;

        var LinhVat = [0, 0, 0, 0, 0, 0];
        for (var index = 0; index < count; index++) {
            var log = cc.RedT.setting.baucua.logs[index];
            LinhVat[log[0]] += 1;
            LinhVat[log[1]] += 1;
            LinhVat[log[2]] += 1;
            var node = cc.instantiate(self.prefabLogs);
            var nodeComponent = node.getComponent("BauCua_logMini");
            nodeComponent.icon.forEach(function (sp, i) {
                sp.spriteFrame = self.iconMini[log[i]];
            });

            self.logs.addChild(node);
        }

        this.logLVHandling(LinhVat);
    },
    onData: function (data) {
        if (void 0 !== data.tops) {
            this.Top && this.Top.node && this.Top.onData(data.tops);
            if (this.disabled) {
                return;
            }
        }
        if (void 0 !== data.viewlogs) {
            this.LichSu && this.LichSu.node && this.LichSu.onData(data.viewlogs);
            if (this.disabled) {
                return;
            }
        }

        if (void 0 !== data.um) {
            this.handleDataUM(data);
            return;
        }

        this.handleDataWithoutUndefined(data);
        this.checkDataFinishWithoutUndefined(data);
    },
    handleDataUM: function (data) {
        if (data && data.um_message) {
            this.umWarningMessage.string = data.um_message;
        }
        this.disabled = true;
        if (!this.timeInterval || cc.RedT.setting.baucua.time_remain === BCConstants.betTime) {
            this.timeInterval && clearInterval(this.timeInterval);
            this.clearCuocAllSlot();
            this.showUMWarning(this.disabled);
        }
    },
    handleDataWithoutUndefined: function (data) {
        if (void 0 !== data.odds) {
            cc.RedT.setting.baucua.odds = data.odds;
            this.updateOddLabels();
        }

        if (void 0 !== data.endCuoc) {
            this.waitingCuoc = false;
            this.showWarningSlowBet(false);

            if (data.endCuoc !== -1) {
                this.addFlyingText(false, data.endCuoc, 1);
            }
        }

        if (void 0 !== data.data) {
            this.dataHandling(data.data);
        }
        if (void 0 !== data.status) {
            this.status(data.status);
        }
        if (void 0 !== data.phien) {
            this.localPhien = data.phien;
        }
        if (void 0 !== data.logs) {
            cc.RedT.setting.baucua.logs = data.logs;
            this.addLogs();
            this.localResultDices = [...data.logs[0]];
        }

        if (void 0 !== data.regOpen) {
            cc.RedT.setting.baucua.regOpen = true;
            this.showUMWarning(this.disabled);
        }
        if (void 0 !== data.time_remain) {
            cc.RedT.setting.baucua.time_remain = data.time_remain;
            this.disabled = false;
            this.showUMWarning(false);
            this.playTime();
        }

        if (void 0 !== data.notice) {
            this.addNotice(data.notice);
        }
    },
    checkDataFinishWithoutUndefined: function (data) {
        if (void 0 !== data.finish) {
            if (cc.RedT.setting.baucua.regOpen) {
                this.unSelect();
                // Huỷ đếm
                void 0 !== this.timeInterval && clearInterval(this.timeInterval);
                // Thêm kết quả
                cc.RedT.setting.baucua.logs.unshift([data.finish.dices[0], data.finish.dices[1], data.finish.dices[2]]);
                cc.RedT.setting.baucua.logs.length > BCConstants.limitLog && cc.RedT.setting.baucua.logs.pop();

                this.localResultDices = [...data.finish.dices];
                this.setDice(this.localResultDices);
                // Play
                this.Animation.node.active = true;
                if (cc.RedT.GAME_IS_SHOWED) {
                    this.Animation.play();
                } else {
                    //force play the end
                    var duration = this.Animation.defaultClip.duration;
                    this.Animation.play("BauCua_plate", duration - 1);
                }
            }
            cc.RedT.setting.baucua.time_remain = BCConstants.betTime + BCConstants.timeToNext + 2;
            if (cc.RedT.GAME_IS_SHOWED) {
                this.playTime();
            }
            this.localPhien = data.finish.phien + 1;

            this.getNewOdds();
        }
    },
    getNewOdds: function () {
        cc.RedT.send({
            g: {
                baucua: {
                    get_odd: true
                }
            }
        });
    },
    updateOddLabels: function () {
        if (!cc.RedT.setting.baucua.odds || cc.RedT.setting.baucua.odds.length < 3) {
            this.oddOne.string = ``;
            this.oddTwo.string = ``;
            this.oddThree.string = ``;
            return;
        }
        var odds = cc.RedT.setting.baucua.odds;
        this.oddOne.string = `1:${odds[0]}`;
        this.oddTwo.string = `1:${odds[1]}`;
        this.oddThree.string = `1:${odds[2]}`;
    },
    setPhien(phien) {
        if (phien === "") {
            this.phienLabel.string = "";
        } else {
            this.phienLabel.string = `#${phien}`;
        }
    },
    clearCuocAllSlot: function () {
        for (var i = 0; i < this.linhVat.length; ++i) {
            this.linhVat[i].clearCuoc();
        }
    },
    resetStateAllSlot: function () {
        for (var i = 0; i < this.linhVat.length; ++i) {
            this.linhVat[i].resetState();
        }
    },
    showWinSlot: function (dices) {
        for (var i = 0; i < this.linhVat.length; ++i) {
            this.linhVat[i].updateState(false);
        }
        dices.forEach((i) => {
            this.linhVat[i].updateState(true);
        });
    },
    playTime: function () {
        if (this.disabled) {
            this.showUMWarning(this.disabled);
            return;
        }

        void 0 !== this.timeInterval && clearInterval(this.timeInterval);
        this.timeInterval = setInterval(
            function () {
                if (cc.RedT.setting.baucua.time_remain > BCConstants.betTime + 1) {
                    this.handleCountDownNextRound();
                } else {
                    this.localResultDices = [];
                    this.waitedTime.node.parent.active = false;
                    this.Animation.node.active = false;
                    this.setPhien(this.localPhien);
                    this.resetStateAllSlot();
                    this.hideAllDices();

                    if (this.handleIsReopenGame()) {
                        return;
                    }

                    if (cc.RedT.setting.baucua.time_remain > 1) {
                        const time = numberPad(cc.RedT.setting.baucua.time_remain - 1, 2);

                        this.animatedTime.node.active = true;
                        this.animatedTime.setTime(time);
                    } else {
                        clearInterval(this.timeInterval);
                    }
                }
                cc.RedT.setting.baucua.time_remain--;
            }.bind(this),
            1000
        );
    },
    handleIsReopenGame: function () {
        if (cc.RedT.setting.baucua.regOpen && cc.RedT.setting.baucua.time_remain === BCConstants.betTime + 1) {
            this.resetGame();
            if (this.disabled) {
                this.animatedTime.node.active = false;
                this.showUMWarning(this.disabled);
                clearInterval(this.timeInterval);
                return true;
            }
        }

        return false;
    },
    handleCountDownNextRound: function () {
        this.waitingCuoc = false;
        const time = numberPad(cc.RedT.setting.baucua.time_remain - (BCConstants.betTime + 2), 2);
        this.animatedTime.node.active = false;
        this.waitedTime.string = time === "00" ? "" : `00:${time}`;
        this.waitedTime.node.parent.active = time !== "00";

        this.localPhien !== "" && this.setPhien(this.localPhien - 1);

        if (this.localResultDices.length > 0) {
            var dices = this.localResultDices;
            this.setDice(dices);
            this.showResultSlots(dices);
        }
    },
    nextRealTime: function () {
        if (cc.RedT.setting.baucua.time_remain > BCConstants.betTime + 1) {
            const time = numberPad(cc.RedT.setting.baucua.time_remain - (BCConstants.betTime + 2), 2);
            this.animatedTime.setTime(numberPad(time, 2), true);
        } else {
            if (cc.RedT.setting.baucua.time_remain > 0) {
                const time = numberPad(cc.RedT.setting.baucua.time_remain - 1, 2);
                this.animatedTime.setTime(time);
            }
        }
    },
    logLVHandling: function (data) {
        this.logHuou.string = numberWithCommas(data[0]);
        this.logBau.string = numberWithCommas(data[1]);
        this.logGa.string = numberWithCommas(data[2]);
        this.logCa.string = numberWithCommas(data[3]);
        this.logCua.string = numberWithCommas(data[4]);
        this.logTom.string = numberWithCommas(data[5]);
    },
    dataHandling: function (data) {
        if (this.red && this.linhVat) {
            this.handleTotalBet(data);
            this.handleTotalBetOfMe(data);
        }
    },
    handleTotalBet: function (data) {
        if (void 0 !== data.redHuou) {
            this.linhVat[0].totallCuoc(data.redHuou);
        }
        if (void 0 !== data.redBau) {
            this.linhVat[1].totallCuoc(data.redBau);
        }
        if (void 0 !== data.redGa) {
            this.linhVat[2].totallCuoc(data.redGa);
        }
        if (void 0 !== data.redCa) {
            this.linhVat[3].totallCuoc(data.redCa);
        }
        if (void 0 !== data.redCua) {
            this.linhVat[4].totallCuoc(data.redCua);
        }
        if (void 0 !== data.redTom) {
            this.linhVat[5].totallCuoc(data.redTom);
        }
    },
    handleTotalBetOfMe: function (data) {
        if (void 0 !== data.meRedHuou) {
            this.linhVat[0].meCuoc(data.meRedHuou);
        }
        if (void 0 !== data.meRedBau) {
            this.linhVat[1].meCuoc(data.meRedBau);
        }
        if (void 0 !== data.meRedGa) {
            this.linhVat[2].meCuoc(data.meRedGa);
        }
        if (void 0 !== data.meRedCa) {
            this.linhVat[3].meCuoc(data.meRedCa);
        }
        if (void 0 !== data.meRedCua) {
            this.linhVat[4].meCuoc(data.meRedCua);
        }
        if (void 0 !== data.meRedTom) {
            this.linhVat[5].meCuoc(data.meRedTom);
        }
    },
    unSelect: function () {
        this.linhVat.forEach(function (linhVat) {
            linhVat.unSelect();
        });
    },
    resetGame: function () {
        var data = Object.keys(cc.RedT.setting.baucua.data);
        data.forEach(function (key) {
            return cc.RedT.setting.baucua.data[key] === 0;
        });
        this.dataHandling(cc.RedT.setting.baucua.data);

        this.unSelect();

        this.resetStateAllSlot();
        this.clearCuocAllSlot();

        this.animatedTime.node.active = false;
        this.waitedTime.node.parent.active = false;
        this.Animation.stop();
        this.Animation.node.active = false;
        this.notice.removeAllChildren();
        this.gameAudios && this.gameAudios.playStartGameAudio();
    },

    addFlyingText(win, value, duration) {
        var temp = new cc.Node();
        temp.addComponent(cc.Label);
        temp = temp.getComponent(cc.Label);
        temp.string = (win ? "+" : "-") + numberWithCommas(value);
        temp.font = win ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
        temp.lineHeight = 130;
        temp.fontSize = 30;
        temp.node.position = cc.v2(0, 90);
        this.notice.addChild(temp.node);
        temp.node.runAction(
            cc.sequence(
                cc.moveTo(duration, cc.v2(0, 200)),
                cc.callFunc(function () {
                    this.node.destroy();
                }, temp)
            )
        );
    },
    status: function (data) {
        if (!cc.RedT.GAME_IS_SHOWED) {
            return;
        }
        this.statusTimeout = setTimeout(
            function () {
                if (data.win) {
                    this.addFlyingText(data.win, data.bet, 4);
                    cc.RedT.send({
                        user: {
                            updateCoin: true
                        }
                    });
                }

                if (void 0 !== data.thuong && data.thuong > 0) {
                    var thuong = new cc.Node();
                    thuong.addComponent(cc.Label);
                    thuong = thuong.getComponent(cc.Label);
                    thuong.string = `+${numberWithCommas(data.thuong)}`;
                    thuong.font = cc.RedT.util.fontEffect;
                    thuong.lineHeight = 90;
                    thuong.fontSize = 14;
                    this.notice.addChild(thuong.node);
                    thuong.node.runAction(
                        cc.sequence(
                            cc.moveTo(3, cc.v2(0, 100)),
                            cc.callFunc(function () {
                                this.node.destroy();
                            }, thuong)
                        )
                    );
                }
            }.bind(this),
            2e3
        );
    },
    initBetChips() {
        var betChipsNode = cc.instantiate(this.betChipsPrefab);
        this.betChips = betChipsNode.getComponent("BetChips");
        this.betChips.init((bet) => {
            this.cuoc = parseInt(bet);
        });
        this.betChipsContainer.addChild(betChipsNode);
    }
});
