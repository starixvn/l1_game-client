import ItemContentMenu from '../../../common/helpers/Menu/ItemContentMenu';
import BigSmall from './BigSmall';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmallStatistic extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    header: cc.Node = null;

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Node)
    nodeTaiXiu: cc.Node = null;

    @property(cc.Label)
    KetQuaLeft: cc.Label = null;

    @property(cc.Label)
    KetQuaRight: cc.Label = null;

    @property(cc.Node)
    KetQuaDot: cc.Node = null;

    @property(cc.Node)
    DiemSoCel: cc.Node = null;

    @property(cc.Label)
    DiemSoLeft: cc.Label = null;

    @property(cc.Label)
    DiemSoRight: cc.Label = null;

    @property(cc.Node)
    node1: cc.Node = null;

    @property(cc.Node)
    node2: cc.Node = null;

    @property(cc.Graphics)
    dice1_line: cc.Graphics = null;

    @property(cc.Graphics)
    dice2_line: cc.Graphics = null;

    @property(cc.Graphics)
    dice3_line: cc.Graphics = null;

    @property(cc.Graphics)
    tong_line: cc.Graphics = null;

    @property(cc.Node)
    dice1_dot: cc.Node = null;

    @property(cc.Node)
    dice2_dot: cc.Node = null;

    @property(cc.Node)
    dice3_dot: cc.Node = null;

    @property(cc.Node)
    tong_dot: cc.Node = null;

    @property(cc.Node)
    line_dotT: cc.Node = null;

    @property(cc.Node)
    line_dot1: cc.Node = null;

    @property(cc.Node)
    line_dot2: cc.Node = null;

    @property(cc.Node)
    line_dot3: cc.Node = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    @property(cc.SpriteFrame)
    whiteDot: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    blackDot: cc.SpriteFrame = null;

    private main: BigSmall;

    init(main: BigSmall) {
        this.main = main;
    }

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };

        this.calculateStatistic();
        this.displayResult();
        this.displayTableStatistic();
        this.updateTXStats(this.main.currentDataLogs);
    }

    calculateStatistic() {
        let bigStats = 0;
        this.main.currentDataLogs.forEach((log) => {
            if (log.settlementResult.big) {
                bigStats += 1;
            }
        });

        this.KetQuaLeft.string = bigStats.toString();
        const smallStats = this.main.currentDataLogs.length - bigStats;
        this.KetQuaRight.string = smallStats.toString();
    }

    displayResult() {
        this.KetQuaDot.children.forEach((dot, index) => {
            const component = dot.getComponent(cc.Sprite);
            component.spriteFrame = this.main.currentDataLogs[index].settlementResult.big ? this.blackDot : this.whiteDot;
        });
    }

    onSelectHeader(event, name) {
        this.header.children.forEach((header) => {
            const menuComponent = header.getComponent(ItemContentMenu);

            if (header.name === name) {
                menuComponent.select();
            } else {
                menuComponent.unselect();
            }
        });

        this.body.children.forEach((body) => {
            if (body.name === name) {
                body.active = true;
            } else {
                body.active = false;
            }
        });
    }

    displayTableStatistic() {
        var newData = this.handlePointsData(this.main.currentDataLogs);
        let totalPoints = {
            cTai: 0,
            cXiu: 0
        };

        this.DiemSoCel.children.forEach((obj, i) => {
            var data = newData[i];
            if (void 0 !== data) {
                obj.active = true;
                totalPoints = this.calculateTotalPoints(totalPoints, obj, data);
            } else {
                obj.active = false;
            }
        });
    }

    handlePointsData(logs) {
        var tmpDS = -1;
        var tmpArrA = [];
        var tmpArrB = [];
        var newArr = logs.slice();
        newArr.reverse();

        for (var newDS of newArr) {
            const point = newDS.result.dice1 + newDS.result.dice2 + newDS.result.dice3;
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

    calculateTotalPoints(totalPoints, obj, data) {
        obj.children.forEach((current, index) => {
            var dataCel = data[index];
            if (void 0 !== dataCel) {
                const type = dataCel > 10 ? true : false;
                totalPoints.cTai = type ? totalPoints.cTai + 1 : totalPoints.cTai;
                totalPoints.cXiu = !type ? totalPoints.cXiu + 1 : totalPoints.cXiu;
                current.active = true;
                current.color = type ? cc.Color.BLACK : cc.Color.WHITE;
                current.children[0].getComponent(cc.Label).string = dataCel;
                current.children[0].color = type ? cc.Color.WHITE : cc.Color.BLACK;
            } else {
                current.active = false;
            }
        });

        return totalPoints;
    }

    onChangerClick() {
        this.node1.active = !this.node1.active;
        this.node2.active = !this.node2.active;
    }

    updateTXStats(logs) {
        this.drawLinePaint(logs);
    }

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
                    var dice1 = sliced[i].result.dice1;
                    var dice2 = sliced[i].result.dice2;
                    var dice3 = sliced[i].result.dice3;
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
            this.draw(this.dice1_line, this.dice1_dot.children, lineDice1);
            this.draw(this.dice2_line, this.dice2_dot.children, lineDice2);
            this.draw(this.dice3_line, this.dice3_dot.children, lineDice3);
            this.draw_Tong(this.tong_line, lineTong);
        });
    }

    lineAc(index, bool) {
        this.dice1_dot.children[index].active = bool;
        this.dice2_dot.children[index].active = bool;
        this.dice3_dot.children[index].active = bool;
        this.tong_dot.children[index].active = bool;
    }

    draw(line, node, data) {
        line.clear();
        var o = data.length;
        for (var n = 0; n < o; n++) {
            var nodeT = node[n],
                point = data[n];
            nodeT.children[0].getComponent(cc.Label).string = point.dice;
            nodeT.position = cc.v2(nodeT.position.x, point.y);
            0 === n ? line.moveTo(point.x, point.y) : line.lineTo(point.x, point.y);
        }
        line.stroke();
    }

    draw_Tong(obj, data) {
        obj.clear();
        for (var n = 0, o = data.length; n < o; n++) {
            var temp = data[n],
                line = this.tong_dot.children[n];
            0 === n ? obj.moveTo(temp.x, temp.y) : obj.lineTo(temp.x, temp.y);
            line.children[0].getComponent(cc.Label).string = temp.tong;
            line.children[0].color = temp.tong > 10 ? cc.Color.WHITE : cc.Color.BLACK;
            line.position = cc.v2(line.position.x, temp.y);
            line.color = temp.tong > 10 ? cc.Color.BLACK : cc.Color.WHITE;
        }
        obj.stroke();
    }
}
