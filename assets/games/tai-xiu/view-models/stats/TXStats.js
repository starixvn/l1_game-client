cc.Class({
    extends: cc.Component,

    properties: {
        background: {
            default: null,
            type: cc.Node
        },
        header: {
            default: null,
            type: cc.Node
        },
        body: {
            default: null,
            type: cc.Node
        },
        nodeTaiXiu: {
            default: null,
            type: cc.Node
        },
        nodeChanLe: {
            default: null,
            type: cc.Node
        },
        KetQuaLeft: {
            default: null,
            type: cc.Label
        },
        KetQuaRight: {
            default: null,
            type: cc.Label
        },
        KetQuaDot: {
            default: null,
            type: cc.Node
        },
        DiemSoCel: {
            default: null,
            type: cc.Node
        },
        DiemSoLeft: {
            default: null,
            type: cc.Label
        },
        DiemSoRight: {
            default: null,
            type: cc.Label
        },
        node1: {
            default: null,
            type: cc.Node
        },
        node2: {
            default: null,
            type: cc.Node
        },
        dice1_line: {
            default: null,
            type: cc.Graphics
        },
        dice2_line: {
            default: null,
            type: cc.Graphics
        },
        dice3_line: {
            default: null,
            type: cc.Graphics
        },
        tong_line: {
            default: null,
            type: cc.Graphics
        },
        dice1_dot: {
            default: null,
            type: cc.Node
        },
        dice2_dot: {
            default: null,
            type: cc.Node
        },
        dice3_dot: {
            default: null,
            type: cc.Node
        },
        tong_dot: {
            default: null,
            type: cc.Node
        },
        line_dotT: {
            default: null,
            type: cc.Node
        },
        line_dot1: {
            default: null,
            type: cc.Node
        },
        line_dot2: {
            default: null,
            type: cc.Node
        },
        line_dot3: {
            default: null,
            type: cc.Node
        },
        mainFrame: {
            default: null,
            type: cc.Node
        }
    },
    init(obj) {
        this.TXRoot = obj;

        if (void 0 !== cc.RedT.setting.taixiu.tk_position) {
            this.node.position = cc.RedT.setting.taixiu.tk_position;
        }

        if (void 0 !== cc.RedT.setting.taixiu.tk_active) {
            this.node.active = cc.RedT.setting.taixiu.tk_active;
        }

        //KetQuaDot
        this.KetQuaDot = this.KetQuaDot.children.map(function (obj) {
            return obj.getComponent(cc.Sprite);
        });

        //DiemSoCel
        var DiemSoCel = Promise.all(
            this.DiemSoCel.children.map(function (cel) {
                cel.RedT = Promise.all(
                    cel.children.map(function (obj) {
                        obj.text = obj.children[0].getComponent(cc.Label);
                        return obj;
                    })
                );
                cel.RedT.then(function (value) {
                    cel.RedT = value;
                });
                return cel;
            })
        ).then((result) => {
            this.DiemSoCel = result;
        });

        //dice1_dot
        var dice1 = Promise.all(
            this.dice1_dot.children.map(function (dot) {
                dot.text = dot.children[0].getComponent(cc.Label);
                return dot;
            })
        ).then((result) => {
            this.dice1_dots = result;
        });

        //dice2_dot
        var dice2 = Promise.all(
            this.dice2_dot.children.map(function (dot) {
                dot.text = dot.children[0].getComponent(cc.Label);
                return dot;
            })
        ).then((result) => {
            this.dice2_dots = result;
        });

        //dice3_dot
        var dice3 = Promise.all(
            this.dice3_dot.children.map(function (dot) {
                dot.text = dot.children[0].getComponent(cc.Label);
                return dot;
            })
        ).then((result) => {
            this.dice3_dots = result;
        });

        //tong_dot
        var sumDot = Promise.all(
            this.tong_dot.children.map(function (dot) {
                dot.text = dot.children[0].getComponent(cc.Label);
                return dot;
            })
        ).then((result) => {
            this.tong_dots = result;
        });

        Promise.all([DiemSoCel, dice1, dice2, dice3, sumDot]).then(() => {
            this.updateTXStats(cc.RedT.setting.taixiu.logs);
        });
    },
    onDestroy() {
        this.TXRoot.TXStats = null;
    },
    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }

        this.ttOffset = null;

        Promise.all(
            this.header.children.map(function (obj) {
                return obj.getComponent("itemContentMenu");
            })
        ).then((result) => {
            this.header = result;
        });

        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };
    },
    onEnable: function () {
        this.background.on(cc.Node.EventType.TOUCH_START, this.eventStart, this);
    },
    onDisable: function () {
        this.background.off(cc.Node.EventType.TOUCH_START, this.eventStart, this);
    },
    onChangerGame: function () {
        this.nodeTaiXiu.active = !this.nodeTaiXiu.active;
        this.nodeChanLe.active = !this.nodeChanLe.active;
    },
    eventStart: function (e) {
        this.setTop();
        this.ttOffset = cc.v2(e.touch.getLocationX() - this.node.position.x, e.touch.getLocationY() - this.node.position.y);
    },
    eventMove: function (e) {
        this.node.position = cc.v2(e.touch.getLocationX() - this.ttOffset.x, e.touch.getLocationY() - this.ttOffset.y);
    },
    eventEnd: function () {
        cc.RedT.setting.taixiu.tk_position = this.node.position;
    },
    setTop: function () {
        this.node.parent.insertChild(this.node);
        this.TXRoot.setTop();
    },
    onSelectHeader: function (event, name) {
        Promise.all(
            this.header.map(function (header) {
                if (header.node.name === name) {
                    header.select();
                } else {
                    header.unselect();
                }
            })
        );
        Promise.all(
            this.body.children.map(function (body) {
                if (body.name === name) {
                    body.active = true;
                } else {
                    body.active = false;
                }
            })
        );
    },
    closeDialog: function () {
        cc.RedT.audio.playClick();
        this.node.destroy();
    },
    onChangerClick: function () {
        this.node1.active = !this.node1.active;
        this.node2.active = !this.node2.active;
    },
    draw: function (line, node, data) {
        line.clear();
        var o = data.length;
        for (var n = 0; n < o; n++) {
            var nodeT = node[n],
                point = data[n];
            nodeT.text.string = point.dice;
            nodeT.position = cc.v2(nodeT.position.x, point.y);
            0 === n ? line.moveTo(point.x, point.y) : line.lineTo(point.x, point.y);
        }
        line.stroke();
    },
    draw_Tong: function (obj, data) {
        obj.clear();
        for (var n = 0, o = data.length; n < o; n++) {
            var temp = data[n],
                line = this.tong_dots[n];
            0 === n ? obj.moveTo(temp.x, temp.y) : obj.lineTo(temp.x, temp.y);
            line.text.string = temp.tong;
            line.text.node.color = temp.tong > 10 ? cc.Color.WHITE : cc.Color.BLACK;
            line.position = cc.v2(line.position.x, temp.y);
            line.color = temp.tong > 10 ? cc.Color.BLACK : cc.Color.WHITE;
        }
        obj.stroke();
    },
    lineAc: function (index, bool) {
        this.dice1_dots[index].active = bool;
        this.dice2_dots[index].active = bool;
        this.dice3_dots[index].active = bool;
        this.tong_dots[index].active = bool;
    },
    showLineTong: function () {
        cc.RedT.audio.playClick();
        this.tong_dot.active = !this.tong_dot.active;
        this.tong_line.node.active = !this.tong_line.node.active;
        this.line_dotT.active = !this.line_dotT.active;
    },
    showLineDice1: function () {
        cc.RedT.audio.playClick();
        this.dice1_dot.active = !this.dice1_dot.active;
        this.dice1_line.node.active = !this.dice1_line.node.active;
        this.line_dot1.active = !this.line_dot1.active;
    },
    showLineDice2: function () {
        cc.RedT.audio.playClick();
        this.dice2_dot.active = !this.dice2_dot.active;
        this.dice2_line.node.active = !this.dice2_line.node.active;
        this.line_dot2.active = !this.line_dot2.active;
    },
    showLineDice3: function () {
        cc.RedT.audio.playClick();
        this.dice3_dot.active = !this.dice3_dot.active;
        this.dice3_line.node.active = !this.dice3_line.node.active;
        this.line_dot3.active = !this.line_dot3.active;
    },

    updateTXStats(logs) {
        this.drawLinePaint(logs);
        this.drawResult(logs);
        this.drawPoints(logs);
    },

    drawLinePaint(logs) {
        var lineTong = [];
        var lineDice1 = [];
        var lineDice2 = [];
        var lineDice3 = [];

        var sliced = logs.slice(0, 19);
        sliced.reverse();
        // Line paint
        new Promise((resolve, reject) => {
            for (var i = 0; i < sliced.length; i++) {
                var data = sliced[i];
                if (void 0 !== data) {
                    this.lineAc(i, true);
                    var dice1 = sliced[i].dice[0];
                    var dice2 = sliced[i].dice[1];
                    var dice3 = sliced[i].dice[2];
                    var tong = dice1 + dice2 + dice3;

                    lineDice1[i] = {
                        x: i * 28,
                        y: dice1 * 28 - 28,
                        dice: dice1
                    };
                    lineDice2[i] = {
                        x: i * 28,
                        y: dice2 * 28 - 28,
                        dice: dice2
                    };
                    lineDice3[i] = {
                        x: i * 28,
                        y: dice3 * 28 - 28,
                        dice: dice3
                    };
                    lineTong[i] = {
                        x: i * 27.7,
                        y: tong * 9.233 - 27.7,
                        tong: tong
                    };
                } else {
                    this.lineAc(i, false);
                }
            }
            this.draw(this.dice1_line, this.dice1_dots, lineDice1);
            this.draw(this.dice2_line, this.dice2_dots, lineDice2);
            this.draw(this.dice3_line, this.dice3_dots, lineDice3);
            this.draw_Tong(this.tong_line, lineTong);
        });
    },

    drawResult(logs) {
        const ketqua = this.KetQuaDot.map((dot, index) => {
            var data = logs[index];
            if (void 0 !== data) {
                dot.node.active = true;
                var kqPoint = data.dice[0] + data.dice[1] + data.dice[2];
                dot.spriteFrame = kqPoint < 11 ? this.TXRoot.TX_Main.dot_white : this.TXRoot.TX_Main.dot_black;
                return kqPoint > 10 ? 1 : 0;
            } else {
                dot.node.active = false;
                return -1;
            }
        });

        this.KetQuaLeft.string = ketqua.filter((i) => i === 1).length;
        this.KetQuaRight.string = ketqua.filter((i) => i === 0).length;
    },

    drawPoints(logs) {
        var newData = this.handlePointsData(logs);
        let totalPoints = {
            cTai: 0,
            cXiu: 0
        };

        this.DiemSoCel.forEach((obj, i) => {
            var data = newData[i];
            if (void 0 !== data) {
                obj.active = true;
                totalPoints = this.calculateTotalPoints(totalPoints, obj, data);
            } else {
                obj.active = false;
            }
        });

        this.DiemSoLeft.string = totalPoints.cTai;
        this.DiemSoRight.string = totalPoints.cXiu;
    },

    calculateTotalPoints(totalPoints, obj, data) {
        obj.RedT.forEach((current, index) => {
            var dataCel = data[index];
            if (void 0 !== dataCel) {
                const type = dataCel > 10 ? true : false;
                totalPoints.cTai = type ? totalPoints.cTai + 1 : totalPoints.cTai;
                totalPoints.cXiu = !type ? totalPoints.cXiu + 1 : totalPoints.cXiu;
                current.active = true;
                current.color = type ? cc.Color.BLACK : cc.Color.WHITE;
                current.text.string = dataCel;
                current.text.node.color = type ? cc.Color.WHITE : cc.Color.BLACK;
            } else {
                current.active = false;
            }
        });

        return totalPoints;
    },

    handlePointsData(logs) {
        var tmpDS = -1;
        var tmpArrA = [];
        var tmpArrB = [];
        var newArr = logs.slice();
        newArr.reverse();
        for (var newDS of newArr) {
            var point = newDS.dice[0] + newDS.dice[1] + newDS.dice[2];
            const type = point > 10 ? 1 : 0;
            if (tmpDS === -1) {
                tmpDS = type;
            }
            if (type !== tmpDS || tmpArrB.length > 4) {
                tmpDS = type;
                tmpArrA.push(tmpArrB);
                tmpArrB = [];
            }
            if (type === tmpDS) {
                tmpArrB.push(point);
            }
        }
        tmpArrA.push(tmpArrB);

        var newData = tmpArrA;
        newData.reverse();
        newData = newData.slice(0, 20);
        newData.reverse();

        return newData;
    }
});
