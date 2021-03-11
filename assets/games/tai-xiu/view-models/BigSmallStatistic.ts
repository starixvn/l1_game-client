import ItemContentMenu from "../../../common/helpers/Menu/ItemContentMenu";

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
    resultDots: cc.Node = null;

    @property(cc.Node)
    pointCels: cc.Node = null;

    @property(cc.Label)
    bigAmountStatistic: cc.Label = null;

    @property(cc.Label)
    smallAmountStatistic: cc.Label = null;

    @property(cc.Node)
    node1: cc.Node = null;

    @property(cc.Node)
    node2: cc.Node = null;

    @property(cc.Graphics)
    dice1Line: cc.Graphics = null;

    @property(cc.Graphics)
    dice2Line: cc.Graphics = null;

    @property(cc.Graphics)
    dice3Line: cc.Graphics = null;

    @property(cc.Graphics)
    tongLine: cc.Graphics = null;

    @property(cc.Node)
    dice1Dot: cc.Node = null;

    @property(cc.Node)
    dice2Dot: cc.Node = null;

    @property(cc.Node)
    dice3Dot: cc.Node = null;

    @property(cc.Node)
    tongDot: cc.Node = null;

    @property(cc.Node)
    lineDotT: cc.Node = null;

    @property(cc.Node)
    lineDot1: cc.Node = null;

    @property(cc.Node)
    lineDot2: cc.Node = null;

    @property(cc.Node)
    lineDot3: cc.Node = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    @property(cc.SpriteFrame)
    whiteDot: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    blackDot: cc.SpriteFrame = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;

    public gameTitle = "";

    private dataLogs;

    init(dataLogs: any) {
        this.dataLogs = dataLogs;

        // expect 99 result;
        this.dataLogs.pop();
    }

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };

        this.titleLabel.string = this.gameTitle.toUpperCase();

        this.showResultDots();
        this.drawLinePaintInChart(this.dataLogs);
    }

    updateStatistic(dataLogs: any) {
        this.init(dataLogs);
        this.showResultDots();
        this.drawLinePaintInChart(this.dataLogs);
        this.showPointsStatistic();
    }

    showResultDots() {
        this.calculateResultStatistic();

        this.resultDots.children.forEach((dot, index) => {
            const component = dot.getComponent(cc.Sprite);
            component.spriteFrame = this.dataLogs[index].settlementResult.big ? this.blackDot : this.whiteDot;
        });
    }

    calculateResultStatistic() {
        let bigStats = 0;

        this.dataLogs.forEach((log) => {
            if (log.settlementResult.big) {
                bigStats += 1;
            }
        });

        this.updateBigSmallAmountStatistic(bigStats, this.dataLogs.length - bigStats);
    }

    updateBigSmallAmountStatistic(big: number, small: number) {
        this.bigAmountStatistic.string = big.toString();
        this.smallAmountStatistic.string = small.toString();
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

        name === "result" ? this.calculateResultStatistic() : this.showPointsStatistic();
    }

    showPointsStatistic() {
        const newData = this.handlePointsData(this.dataLogs);
        let totalPoints = {
            cTai: 0,
            cXiu: 0
        };

        this.pointCels.children.forEach((obj, i) => {
            const data = newData[i];
            if (void 0 !== data) {
                obj.active = true;
                totalPoints = this.calculateTotalPoints(totalPoints, obj, data);
            } else {
                obj.active = false;
            }
        });

        this.updateBigSmallAmountStatistic(totalPoints.cTai, totalPoints.cXiu);
    }

    handlePointsData(logs) {
        let tmpDS = -1;
        const tmpArrA = [];
        let tmpArrB = [];
        const newArr = logs.slice();
        newArr.reverse();

        for (const newDS of newArr) {
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

        let newData = tmpArrA;
        newData.reverse();
        newData = newData.slice(0, 20);
        newData.reverse();

        return newData;
    }

    calculateTotalPoints(totalPoints, obj, data) {
        obj.children.forEach((current, index) => {
            const dataCel = data[index];
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

    drawLinePaintInChart(logs) {
        const lineTong = [];
        const lineDice1 = [];
        const lineDice2 = [];
        const lineDice3 = [];

        const sliced = logs.slice(0, 19);
        sliced.reverse();
        // Line paint
        new Promise((resolve, reject) => {
            for (let i = 0; i < sliced.length; i++) {
                const data = sliced[i];
                if (void 0 !== data) {
                    this.handleDotsActiveInChart(i, true);
                    const dice1 = sliced[i].result.dice1;
                    const dice2 = sliced[i].result.dice2;
                    const dice3 = sliced[i].result.dice3;
                    const tong = dice1 + dice2 + dice3;

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
                    this.handleDotsActiveInChart(i, false);
                }
            }
            this.draw(this.dice1Line, this.dice1Dot.children, lineDice1);
            this.draw(this.dice2Line, this.dice2Dot.children, lineDice2);
            this.draw(this.dice3Line, this.dice3Dot.children, lineDice3);
            this.draw_Tong(this.tongLine, lineTong);
        });
    }

    handleDotsActiveInChart(index, bool) {
        this.dice1Dot.children[index].active = bool;
        this.dice2Dot.children[index].active = bool;
        this.dice3Dot.children[index].active = bool;
        this.tongDot.children[index].active = bool;
    }

    draw(line, node, data) {
        line.clear();
        const o = data.length;
        for (let n = 0; n < o; n++) {
            const nodeT = node[n],
                point = data[n];
            nodeT.children[0].getComponent(cc.Label).string = point.dice;
            nodeT.position = cc.v2(nodeT.position.x, point.y);
            0 === n ? line.moveTo(point.x, point.y) : line.lineTo(point.x, point.y);
        }
        line.stroke();
    }

    draw_Tong(obj, data) {
        obj.clear();
        for (let n = 0, o = data.length; n < o; n++) {
            const temp = data[n],
                line = this.tongDot.children[n];
            0 === n ? obj.moveTo(temp.x, temp.y) : obj.lineTo(temp.x, temp.y);
            line.children[0].getComponent(cc.Label).string = temp.tong;
            line.children[0].color = temp.tong > 10 ? cc.Color.WHITE : cc.Color.BLACK;
            line.position = cc.v2(line.position.x, temp.y);
            line.color = temp.tong > 10 ? cc.Color.BLACK : cc.Color.WHITE;
        }
        obj.stroke();
    }

    changeView() {
        this.node1.active = !this.node1.active;
        this.node2.active = !this.node2.active;
    }
}
