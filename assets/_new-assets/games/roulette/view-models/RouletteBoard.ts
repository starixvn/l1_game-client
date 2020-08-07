import * as _ from 'lodash';
import { RouletteBetType, RouletteBetInfo } from './Roulette';
import RouletteGroupBetItem from './RouletteGroupBetItem';
import RouletteNumber from './RouletteNumber';
import RouletteUtils from './RouletteUtils';
import RouletteUtils from './RouletteUtils';
const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteBoard extends cc.Component {

    @property(cc.Node)
    groupItemNode: cc.Node = null;

    @property(cc.Node)
    touchArea: cc.Node = null;

    @property(cc.Node)
    gridStartNode: cc.Node = null;

    @property(cc.Node)
    chipContainer: cc.Node = null;

    @property(cc.SpriteAtlas)
    chipAltas: cc.SpriteAtlas = null;

    @property(cc.Node)
    numberContainer: cc.Node = null;

    @property
    middleCellOffset = 20;

    private cellSize: cc.Size;
    groupItems: RouletteGroupBetItem[] = [];
    rouletteNumbers: RouletteNumber[] = [];

    private betChoices = {};

    public callback = {
        selected: (betInfo: RouletteBetInfo) => { }
    }

    onLoad() {
        this.cellSize = new cc.Size(this.gridStartNode.width, this.gridStartNode.height);
        this.initGroupBetItems();
        this.rouletteNumbers = this.numberContainer.children.map(child => child.getComponent(RouletteNumber));

        this.touchArea.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.touchArea.on(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.touchArea.on(cc.Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);
    }

    onDestroy() {
        this.touchArea.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.touchArea.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.touchArea.off(cc.Node.EventType.MOUSE_MOVE, this.onTouchMove, this);
        this.touchArea.off(cc.Node.EventType.MOUSE_LEAVE, this.onTouchCancel, this);
    }

    onTouchMove(e) {
        const localLocation = this.touchArea.convertToNodeSpaceAR(e.getLocation());
        const location = localLocation.sub(this.gridStartNode.position);
        if (location.x < -this.middleCellOffset && location.y < this.gridStartNode.y) {
            return;
        }

        const betInfo = this.getBetInfo(location);
        this.highlightNumbers(betInfo.numbers);
    }

    onTouchEnd(e) {
        const localLocation = this.touchArea.convertToNodeSpaceAR(e.getLocation());
        const location = localLocation.sub(this.gridStartNode.position);
        if (location.x < -this.middleCellOffset && location.y < this.gridStartNode.y) {
            return;
        }

        const betInfo = this.getBetInfo(location);
        this.callback.selected(betInfo);
    }

    onTouchCancel(e) {
        this.clearHighlight();
    }

    internalHighlight(highlight, numbers) {
        if (highlight) {
            this.highlightNumbers(numbers);
        } else {
            this.clearHighlight();
        }
    }

    highlightLastResult(result: number) {
        this.rouletteNumbers.forEach(n => {
            if (result === +n.node.name) {
                n.showWinning();
            } else {
                n.clearHighlight();
            }
        });

        this.groupItems.forEach(item => {
            const index = item.getNumbers().findIndex(n => n === result);
            if (index > -1) {
                item.showWinning();
            } else {
                item.clearHighlight();
            }
        });
    }

    initGroupBetItems() {
        this.groupItems = this.groupItemNode.children.map(child => child.getComponent(RouletteGroupBetItem));
        this.groupItems.forEach(item => {
            item.groupBetItemCallback.highlight = (highlight, numbers) => {
                this.internalHighlight(highlight, numbers);
            };
            item.groupBetItemCallback.selected = (betType, numbers) => {
                const betInfo: RouletteBetInfo = {
                    type: betType,
                    numbers,
                }
                this.callback.selected(betInfo);
            };
        });
    }

    getNumber(col: number, row: number): number {
        if (row < 0) {
            return -1;
        }
        col = Math.min(col, 11);
        row = Math.min(row, 2);

        return col < 0 ? 0 : col * 3 + row + 1;
    }

    getBetInfo(location: cc.Vec2): RouletteBetInfo {
        const col = Math.floor(location.x / this.cellSize.width);
        const row = Math.floor(location.y / this.cellSize.height);

        const offsetX = location.x - col * this.cellSize.width;
        const offsetY = location.y - row * this.cellSize.height;

        const colArr = [col];
        let rowArr = [row];
        if (offsetX < this.middleCellOffset) {
            colArr.push(col - 1);
        } else if (offsetX > this.cellSize.width - this.middleCellOffset) {
            colArr.push(col + 1);
        }

        let isSpecial = false;
        if (offsetY < this.middleCellOffset) {
            rowArr.push(row - 1);
            if (row == 0) {
                isSpecial = true;
            }
        } else if (offsetY > this.cellSize.height - this.middleCellOffset) {
            rowArr.push(row + 1);
            if (row < 0) {
                isSpecial = true;
            }
        }

        if (isSpecial) {
            rowArr = [0, 1, 2];
        }

        let selectNumbers = [];
        colArr.forEach(colElement => {
            rowArr.forEach(rowElement => {
                const element = this.getNumber(colElement, rowElement);
                if (element != -1) {
                    selectNumbers.push(element);
                }
            });
        })

        selectNumbers = _.uniq(selectNumbers.sort((a, b) => a - b));

        const count = selectNumbers.length;
        let type: RouletteBetType;
        switch (count) {
            case 6:
                type = RouletteBetType.Line;
                break;
            case 4:
                type = isSpecial ? RouletteBetType.FourNumbers : RouletteBetType.Corner;
                break;
            case 3:
                type = isSpecial ? RouletteBetType.Street : RouletteBetType.Triangle;
                break;
            case 2:
                type = RouletteBetType.Split;
                break;
            default:
                type = RouletteBetType.StraightUp;
                break;
        }

        const betInfo: RouletteBetInfo = {
            type: type,
            numbers: selectNumbers,
        }
        return betInfo;
    }

    getLocation(betNumber: number): cc.Vec2 {
        const col = Math.floor((betNumber - 1) / 3);
        const row = (betNumber - 1) % 3;

        return cc.v2(col * this.cellSize.width, row * this.cellSize.height);
    }

    addOwnBet(betInfo: RouletteBetInfo, bet: number) {
        const betKey = RouletteUtils.getKey(betInfo);

        if (!this.betChoices[betInfo.type]) {
            this.betChoices[betInfo.type] = {};
        }
        const current = this.betChoices[betInfo.type][betKey] || 0;
        this.betChoices[betInfo.type][betKey] = current + bet;
        this.placeChips({
            type: betInfo.type,
            numbers: betInfo.numbers,
        }, this.betChoices[betInfo.type][betKey]);
    }

    showBetChoices(betChoices: any) {
        this.chipContainer.removeAllChildren();
        this.betChoices = _.cloneDeep(betChoices);

        for (let type in this.betChoices) {
            for (let key in this.betChoices[type]) {
                this.placeChipsByKey(type, key, this.betChoices[type][key]);
            }
        }
    }

    getBetNodeByKey(type: string, key: string): cc.Node {
        const childName = `${type}_${key}`;
        let childNode = this.chipContainer.getChildByName(childName);
        if (!childNode) {
            childNode = new cc.Node();
            childNode.name = childName;
            this.chipContainer.addChild(childNode);
            switch (type) {
                case RouletteBetType.Column:
                case RouletteBetType.Dozen:
                case RouletteBetType.RedBlack:
                case RouletteBetType.OddEven:
                case RouletteBetType.BigSmall:
                    const groupItem = this.groupItems.find(child => child.betType === type && child.node.name === key);
                    childNode.position = this.chipContainer.convertToNodeSpaceAR(groupItem.node.convertToWorldSpaceAR(cc.v2(0, 0)));
                    break;
                default:
                    childNode.position = this.getOnBoardChipLocation(type, key);
                    break;
            }
        }

        return childNode;
    }

    placeChipsByKey(type: string, key: string, bet: number) {
        const childNode = this.getBetNodeByKey(type, key);
        childNode.destroyAllChildren();
        const node = this.createChips(bet);
        childNode.addChild(node);
    }

    placeChips(betInfo: RouletteBetInfo, bet: number) {
        const childNode = this.getBetNodeByKey(betInfo.type, RouletteUtils.getKey(betInfo));
        childNode.destroyAllChildren();
        const node = this.createChips(bet);
        childNode.addChild(node);
    }

    getOnBoardChipLocation(type, key) {
        const numbers = RouletteUtils.parseKeyToNumbers(key);
        let location = this.getLocation(numbers[0]);
        const offset = cc.v2(this.cellSize.width / 2, this.cellSize.height / 2);
        switch (type) {
            case RouletteBetType.Line:
                location = this.getLocation(numbers[3]);
                break;
            case RouletteBetType.FourNumbers:
                location = this.getLocation(numbers[1]);
                break;
            case RouletteBetType.Corner:
                location = this.getLocation(numbers[3]);
                break;
            case RouletteBetType.Street:
                location = location.add(cc.v2(offset.x, 0));
                break
            case RouletteBetType.Triangle:
                location = this.getLocation(numbers[2]);
                break;
            case RouletteBetType.Split:
                if (numbers[0] === 0) {
                    location = location = this.getLocation(numbers[1]).add(cc.v2(0, offset.y));
                } else {
                    const location2 = this.getLocation(numbers[1]).add(offset);
                    location = location.add(offset);
                    location = location.add(location2).mul(0.5);
                }
                break;
            case RouletteBetType.StraightUp:
                location = location.add(offset);
                if (numbers[0] === 0) {
                    location = location.add(cc.v2(0, this.cellSize.height * 2))
                }
                break;
            default:
                break;
        }

        return location;
    }

    private createChips(bet: number): cc.Node {
        const values = [50, 10, 5, 1];
        let total = bet;
        const counts = [];
        values.forEach(value => {
            counts.push(Math.floor(total / value));
            total = total % value;
        });

        const node = new cc.Node();
        const layoutNode = new cc.Node();
        layoutNode.y = -13; //half size chip
        node.addChild(layoutNode);
        layoutNode.anchorY = 0;
        const layout = layoutNode.addComponent(cc.Layout);
        layout.type = cc.Layout.Type.VERTICAL;
        layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        layout.verticalDirection = cc.Layout.VerticalDirection.BOTTOM_TO_TOP;
        layout.spacingY = -22;
        counts.forEach((count, index) => {
            for (let i = 0; i < count; i++) {
                const chipNode = this.createChip(values[index]);
                layoutNode.addChild(chipNode);
            }
        });
        return node;
    }

    private createChip(bet: number): cc.Node {
        var chip = new cc.Node();
        var chipSprite = chip.addComponent(cc.Sprite);
        var name = `chip${bet}_small`;
        chipSprite.spriteFrame = this.chipAltas.getSpriteFrame(name);
        return chip;
    }

    highlightNumbers(numbers: number[]) {
        this.clearHighlight();
        numbers.forEach(i => {
            this.rouletteNumbers[i].showHighlight();
        });
    }

    clearHighlight() {
        this.rouletteNumbers.forEach(number => { number.clearHighlight(); });
    }
}
