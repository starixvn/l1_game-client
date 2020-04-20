import ChanLe from "../ChanLe";
import TabMenu from "../../../../common/tab-menu/TabMenu";
const { ccclass, property } = cc._decorator;

@ccclass
export default class ChanLeStats extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Node)
    header: cc.Node = null;

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Node)
    resultForm: cc.Node = null;

    @property(cc.Node)
    dicesLineForm: cc.Node = null;

    @property(cc.Node)
    resultDots: cc.Node = null;

    @property(cc.Label)
    totalResultLeft: cc.Label = null;

    @property(cc.Label)
    totalResultRight: cc.Label = null;

    @property(cc.Node)
    pointCells: cc.Node = null;

    @property(cc.Label)
    totalPointsLeft: cc.Label = null;

    @property(cc.Label)
    totalPointsRight: cc.Label = null;

    @property(cc.Node)
    firstDiceDots: cc.Node = null;

    @property(cc.Node)
    secondDiceDots: cc.Node = null;

    @property(cc.Node)
    thirdDiceDots: cc.Node = null;

    @property(cc.Node)
    totalDots: cc.Node = null;

    @property(cc.Graphics)
    firstDiceLine: cc.Graphics = null;

    @property(cc.Graphics)
    secondDiceLine: cc.Graphics = null;

    @property(cc.Graphics)
    thirdDiceLine: cc.Graphics = null;

    @property(cc.Graphics)
    totalLine: cc.Graphics = null;

    @property(cc.Node)
    firstDiceButton: cc.Node = null;

    @property(cc.Node)
    secondDiceButton: cc.Node = null;

    @property(cc.Node)
    thirdDiceButton: cc.Node = null;

    @property(cc.Node)
    totalButton: cc.Node = null;

    @property(cc.SpriteFrame)
    dotLeft: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dotRight: cc.SpriteFrame = null;

    private root: ChanLe;
    private currentResultDots: cc.Sprite[] = [];
    private currentPointCells: Dots[] = [];
    private currentFirstDiceDots: Dot[] = [];
    private currentSecondDiceDots: Dot[] = [];
    private currentThirdDiceDots: Dot[] = [];
    private currentTotalDots: Dot[] = [];
    private currentHeaderTabs: TabMenu[];

    init(root: ChanLe) {
        this.root = root;
        this.initStats();
        this.title.string = this.root.gameTitle.toUpperCase();
    }

    onLoad() {
        Promise.all(this.header.children.map((obj) => {
            return obj.getComponent('TabMenu') as TabMenu;
        })).then(tabs => {
            this.currentHeaderTabs = tabs;
        });
    }

    onDisable() {
        this.root.hideStats();
        this.node.destroyAllChildren();
        this.node.destroy();
    }

    onSelectHeaderTab(event, name) {
        Promise.all(this.currentHeaderTabs.map(function (tab) {
            if (tab.node.name == name) {
                tab.select();
            } else {
                tab.unselect();
            }
        }));

        Promise.all(this.body.children.map(function (body) {
            if (body.name == name) {
                body.active = true;
            } else {
                body.active = false;
            }
        }));
    }

    onNextPreviousButtonClick() {
        this.resultForm.active = !this.resultForm.active;
        this.dicesLineForm.active = !this.dicesLineForm.active;
    }

    showLineTotal() {
        cc.RedT.audio.playClick();
        this.totalDots.active = !this.totalDots.active;
        this.totalLine.node.active = !this.totalLine.node.active;
        this.totalButton.active = !this.totalButton.active;
    }

    showLineFirstDice() {
        cc.RedT.audio.playClick();
        this.firstDiceDots.active = !this.firstDiceDots.active;
        this.firstDiceLine.node.active = !this.firstDiceLine.node.active;
        this.firstDiceButton.active = !this.firstDiceButton.active;
    }

    showLineSecondDice() {
        cc.RedT.audio.playClick();
        this.secondDiceDots.active = !this.secondDiceDots.active;
        this.secondDiceLine.node.active = !this.secondDiceLine.node.active;
        this.secondDiceButton.active = !this.secondDiceButton.active;
    }

    showLineThirdDice() {
        cc.RedT.audio.playClick();
        this.thirdDiceDots.active = !this.thirdDiceDots.active;
        this.thirdDiceLine.node.active = !this.thirdDiceLine.node.active;
        this.thirdDiceButton.active = !this.thirdDiceButton.active;
    }

    drawStatistics() {
        var logs = this.root.main.dataLogs;
        this.drawDiceCharts(logs);
        this.drawResult(logs);
        this.drawPoints(logs);
    }

    private initStats() {
        this.currentResultDots = this.resultDots.children.map((dot) => {
            return dot.getComponent(cc.Sprite);
        });
        var pointCells = Promise.all(this.pointCells.children.map((pointCell: Dots) => {
            Promise.all(pointCell.children.map((point: Dot) => {
                point.dotText = point.children[0].getComponent(cc.Label);
                return point;
            })).then(points => {
                pointCell.dots = points;
            });
            return pointCell;
        })).then(pointCells => {
            this.currentPointCells = pointCells;
        });
        var firstDiceDots = Promise.all(this.firstDiceDots.children.map((dot: Dot) => {
            dot.dotText = dot.children[0].getComponent(cc.Label);
            return dot;
        })).then(dots => {
            this.currentFirstDiceDots = dots;
        });
        var secondDiceDots = Promise.all(this.secondDiceDots.children.map((dot: Dot) => {
            dot.dotText = dot.children[0].getComponent(cc.Label);
            return dot;
        })).then(dots => {
            this.currentSecondDiceDots = dots;
        });
        var thirdDiceDots = Promise.all(this.thirdDiceDots.children.map((dots: Dot) => {
            dots.dotText = dots.children[0].getComponent(cc.Label);
            return dots;
        })).then(dots => {
            this.currentThirdDiceDots = dots;
        });
        var totalDots = Promise.all(this.totalDots.children.map((dot: Dot) => {
            dot.dotText = dot.children[0].getComponent(cc.Label);
            return dot;
        })).then(dots => {
            this.currentTotalDots = dots;
        });
        Promise.all([pointCells, firstDiceDots, secondDiceDots, thirdDiceDots, totalDots])
            .then(() => {
                this.drawStatistics();
            });
    }

    private drawDiceCharts(logs: any) {
        var slicedLogs = logs.slice(0, 19);
        slicedLogs.reverse();

        var self = this;
        var firstDiceLine = [];
        var secondDiceLine = [];
        var thirdDiceLine = [];
        var totalLine = [];

        for (var index = 0; index < slicedLogs.length; index++) {
            var log = slicedLogs[index];
            if (log) {
                self.activateDot(index, true);
                var dice1 = log.dice[0];
                var dice2 = log.dice[1];
                var dice3 = log.dice[2];
                var tong = dice1 + dice2 + dice3;
                firstDiceLine[index] = { x: index * 28, y: dice1 * 28 - 28, dice: dice1 };
                secondDiceLine[index] = { x: index * 28, y: dice2 * 28 - 28, dice: dice2 };
                thirdDiceLine[index] = { x: index * 28, y: dice3 * 28 - 28, dice: dice3 };
                totalLine[index] = { x: index * 27.7, y: tong * 9.233 - 27.7, tong: tong };
            }
            else {
                self.activateDot(index, false);
            }
        }
        self.drawDiceLine(self.firstDiceLine, self.currentFirstDiceDots, firstDiceLine);
        self.drawDiceLine(self.secondDiceLine, self.currentSecondDiceDots, secondDiceLine);
        self.drawDiceLine(self.thirdDiceLine, self.currentThirdDiceDots, thirdDiceLine);
        self.drawTotalLine(self.totalLine, totalLine);
    }

    private drawResult(logs: any) {
        var self = this;

        var result = self.currentResultDots.map(function (dot, index) {
            var log = logs[index];
            if (log) {
                dot.node.active = true;
                var point = log.dice[0] + log.dice[1] + log.dice[2];
                dot.spriteFrame = point % 2 ? self.dotLeft : self.dotRight;
                return point % 2 ? 0 : 1;
            }
            else {
                dot.node.active = false;
                return -1;
            }
        });

        self.totalResultLeft.string = result.filter(i => i == 1).length.toString();
        self.totalResultRight.string = result.filter(i => i == 0).length.toString();
    }

    private drawPoints(logs: any) {
        var self = this;
        var currentType = -1;
        var pointsData = [];
        var pointsDataOfType = [];
        var totalLeft = 0;
        var totalRight = 0;
        // Diem So
        var pointLogs = logs.slice();
        pointLogs.reverse();

        for (var pointLog of pointLogs) {
            var point = pointLog.dice[0] + pointLog.dice[1] + pointLog.dice[2];
            var type = point % 2 ? 0 : 1;
            if (currentType === -1) {
                currentType = type;
            }
            if (type != currentType || pointsDataOfType.length > 4) {
                currentType = type;
                pointsData.push(pointsDataOfType);
                pointsDataOfType = [];
            }
            if (type == currentType) {
                pointsDataOfType.push(point);
            }
        }
        pointsData.push(pointsDataOfType);
        var slicedPointsData = pointsData.reverse().slice(0, 20).reverse();

        this.currentPointCells.forEach(function (pointCell, index) {
            var pointsDataOfType = slicedPointsData[index];
            if (pointsDataOfType) {
                pointCell.active = true;
                return Promise.all(pointCell.dots.map(function (dot, index) {
                    var pointsData = pointsDataOfType[index];
                    if (pointsData) {
                        dot.active = true;
                        dot.dotText.string = pointsData;
                        var type = pointsData % 2 ? false : true;
                        totalLeft = type ? totalLeft + 1 : totalLeft;
                        totalRight = !type ? totalRight + 1 : totalRight;
                        dot.color = type ? cc.Color.WHITE : cc.Color.BLACK;
                        dot.dotText.node.color = type ? cc.Color.BLACK : cc.Color.WHITE;
                    }
                    else {
                        dot.active = false;
                    }
                    return void 0;
                }));
            }
            else {
                pointCell.active = false;
            }
            return void 0;
        });
        self.totalPointsLeft.string = totalLeft.toString();
        self.totalPointsRight.string = totalRight.toString();
    }

    private drawDiceLine(line: cc.Graphics, dots: Dot[], data: any) {
        line.clear();
        var dataLength = data.length;

        for (var index = 0; index < dataLength; index++) {
            var dot = dots[index], point = data[index];
            dot.dotText.string = point.dice;
            dot.position = cc.v2(dot.position.x, point.y);
            index == 0 ? line.moveTo(point.x, point.y) : (line.lineTo(point.x, point.y));
        }

        line.stroke();
    }

    private drawTotalLine(line: cc.Graphics, data: any) {
        line.clear()

        for (var index = 0, dataLength = data.length; index < dataLength; index++) {
            var dotData = data[index], dot = this.currentTotalDots[index];
            index == 0 ? line.moveTo(dotData.x, dotData.y) : (line.lineTo(dotData.x, dotData.y));
            dot.dotText.string = dotData.tong;
            dot.position = cc.v2(dot.position.x, dotData.y);

            dot.dotText.node.color = (dotData.tong % 2 ? cc.Color.BLACK : cc.Color.WHITE);
            dot.color = dotData.tong % 2 ? cc.Color.WHITE : cc.Color.BLACK;
        }

        line.stroke();
    }

    private activateDot(index: number, isActive: boolean) {
        this.currentFirstDiceDots[index].active = isActive;
        this.currentSecondDiceDots[index].active = isActive;
        this.currentThirdDiceDots[index].active = isActive;
        this.currentTotalDots[index].active = isActive;
    }
}

class Dots extends cc.Node {
    dots: Dot[] = [];
}

class Dot extends cc.Node {
    dotText: cc.Label;
}