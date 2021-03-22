import _ = require('lodash');

import CommonDialog from '../../../common/_base/view-models/CommonDialog';
import ItemContentMenu from '../../../common/helpers/Menu/ItemContentMenu';

const { ccclass, property } = cc._decorator;

type TotalType = {
    left: number;
    right: number;
};

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
    leftAmountStatistic: cc.Label = null;

    @property(cc.Label)
    rightAmountStatistic: cc.Label = null;

    @property(cc.Node)
    resultForm: cc.Node = null;

    @property(cc.Node)
    dicesLineForm: cc.Node = null;

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
    protected dataLogs;
    protected readonly betTypes = ["big", "small"];
    protected activeTab = "result";

    init(dataLogs: any) {
        this.dataLogs = dataLogs.length > 89 ? _.slice(dataLogs, 0, 89) : dataLogs;
    }

    onLoad() {
        const commonDialog = this.mainFrame.getComponent(CommonDialog);
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

        if (this.activeTab !== "result") {
            this.calculatePointsStatistic();
        }
    }

    showResultDots() {
        this.calculateResultStatistic();

        this.resultDots.children.forEach((dot, index) => {
            if (index > this.dataLogs.length) {
                return;
            }
            const component = dot.getComponent(cc.Sprite);
            component.spriteFrame = this.dataLogs[index].settlementResult[this.betTypes[0]] ? this.blackDot : this.whiteDot;
        });
    }

    calculateResultStatistic() {
        let leftStats = 0;

        this.dataLogs.forEach((log) => {
            if (log.settlementResult[this.betTypes[0]]) {
                leftStats += 1;
            }
        });
        this.updateLeftRightAmountStatistic(leftStats, this.dataLogs.length - leftStats);
    }

    updateLeftRightAmountStatistic(leftValue: number, rightValue: number) {
        this.leftAmountStatistic.string = leftValue.toString();
        this.rightAmountStatistic.string = rightValue.toString();
    }

    onSelectHeader(event, name) {
        this.header.children.forEach((header) => {
            const menuComponent = header.getComponent(ItemContentMenu);

            if (header.name === name) {
                this.activeTab = name;
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

        name === "result" ? this.calculateResultStatistic() : this.calculatePointsStatistic();
    }

    calculatePointsStatistic() {
        let pointsData = [];
        let totalType: TotalType = {
            left: 0,
            right: 0
        };

        pointsData = this.handlePointsData(this.dataLogs, pointsData);
        const slicedPointsData = [...pointsData].reverse().slice(0, 20).reverse();
        console.log(slicedPointsData.length);

        this.pointCels.children.forEach((pointCell, i) => {
            const pointsDataOfType = slicedPointsData[i];
            if (pointsDataOfType) {
                pointCell.active = true;
                totalType = this.handleTotalType(totalType, pointCell, pointsDataOfType);
            } else {
                pointCell.active = false;
            }
        });

        this.updateLeftRightAmountStatistic(totalType.left, totalType.right);
    }

    handlePointsData(logs, pointsData: any) {
        let currentType = null;
        let pointsDataOfType = [];
        const pointLogs = logs.slice();
        pointLogs.reverse();

        for (const pointLog of pointLogs) {
            const points = pointLog.result.dice1 + pointLog.result.dice2 + pointLog.result.dice3;
            const type = pointLog.settlementResult[this.betTypes[0]] ? true : false;

            if (currentType === null) {
                currentType = type;
            }

            if (type !== currentType || pointsDataOfType.length > 4) {
                currentType = type;
                pointsData.push(pointsDataOfType);
                pointsDataOfType = [];
            }
            if (type === currentType) {
                pointsDataOfType.push(points);
            }
        }
        pointsData.push(pointsDataOfType);

        return pointsData;
    }

    handleTotalType(totalType, pointCell: any, pointsDataOfType: any): TotalType {
        pointCell.children.forEach((dot, index) => {
            const pointsData = pointsDataOfType[index];
            if (pointsData) {
                const type = this.checkPointResult(pointsData);
                totalType.left = type ? totalType.left + 1 : totalType.left;
                totalType.right = !type ? totalType.right + 1 : totalType.right;
                dot.active = true;
                dot.color = type ? cc.Color.BLACK : cc.Color.WHITE;
                dot.children[0].getComponent(cc.Label).string = pointsData;
                dot.children[0].color = type ? cc.Color.WHITE : cc.Color.BLACK;
            } else {
                dot.active = false;
            }
        });

        return totalType;
    }

    checkPointResult(points: number) {
        return points > 10 ? true : false;
    }

    drawLinePaintInChart(logs) {
        const totalLine = [];
        const firstDiceLine = [];
        const secondDiceLine = [];
        const thirdDiceLine = [];

        const slicedLogs = logs.slice(0, 19);
        slicedLogs.reverse();

        for (let index = 0; index < slicedLogs.length; index++) {
            const data = slicedLogs[index];
            if (void 0 !== data) {
                this.activeDotsInChart(index, true);
                const dice1 = slicedLogs[index].result.dice1;
                const dice2 = slicedLogs[index].result.dice2;
                const dice3 = slicedLogs[index].result.dice3;
                const tong = dice1 + dice2 + dice3;

                firstDiceLine[index] = {
                    x: index * 28,
                    y: dice1 * 28 - 28,
                    dice: dice1
                };
                secondDiceLine[index] = {
                    x: index * 28,
                    y: dice2 * 28 - 28,
                    dice: dice2
                };
                thirdDiceLine[index] = {
                    x: index * 28,
                    y: dice3 * 28 - 28,
                    dice: dice3
                };
                totalLine[index] = {
                    x: index * 27.7,
                    y: tong * 9.233 - 27.7,
                    tong: tong,
                    betChoice: slicedLogs[index].settlementResult[this.betTypes[0]]
                };
            } else {
                this.activeDotsInChart(index, false);
            }
        }
        this.drawDiceLine(this.dice1Line, this.dice1Dot.children, firstDiceLine);
        this.drawDiceLine(this.dice2Line, this.dice2Dot.children, secondDiceLine);
        this.drawDiceLine(this.dice3Line, this.dice3Dot.children, thirdDiceLine);
        this.drawTotalLine(this.tongLine, totalLine);
    }

    activeDotsInChart(index, bool) {
        this.dice1Dot.children[index].active = bool;
        this.dice2Dot.children[index].active = bool;
        this.dice3Dot.children[index].active = bool;
        this.tongDot.children[index].active = bool;
    }

    drawDiceLine(line: cc.Graphics, node, data: any) {
        line.clear();
        const dataLength = data.length;
        for (let index = 0; index < dataLength; index++) {
            const dot = node[index],
                point = data[index];
            dot.children[0].getComponent(cc.Label).string = point.dice;
            dot.position = cc.v2(dot.position.x, point.y);
            index === 0 ? line.moveTo(point.x, point.y) : line.lineTo(point.x, point.y);
        }
        line.stroke();
    }

    drawTotalLine(line: cc.Graphics, data) {
        line.clear();
        for (let index = 0, dataLength = data.length; index < dataLength; index++) {
            const dotData = data[index],
                dot = this.tongDot.children[index];
            0 === index ? line.moveTo(dotData.x, dotData.y) : line.lineTo(dotData.x, dotData.y);
            dot.children[0].getComponent(cc.Label).string = dotData.tong;
            dot.children[0].color = dotData.betChoice ? cc.Color.WHITE : cc.Color.BLACK;

            dot.position = cc.v2(dot.position.x, dotData.y);
            dot.color = dotData.betChoice ? cc.Color.BLACK : cc.Color.WHITE;
        }
        line.stroke();
    }

    onNextPreviousButtonClick() {
        this.resultForm.active = !this.resultForm.active;
        this.dicesLineForm.active = !this.dicesLineForm.active;
    }
}
