import RouletteNumber from "./RouletteNumber";
import RouletteGroupBetItem from "./RouletteGroupBetItem";
import { RouletteBetInfo, RouletteBetType } from "./Roulette";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteQuickBet extends cc.Component {
    @property(cc.Node)
    numberContainer: cc.Node = null;

    @property(cc.Node)
    groupItemNode: cc.Node = null;

    rouletteNumbers: RouletteNumber[] = [];
    groupItems: RouletteGroupBetItem[] = [];

    public callback = {
        highlight: (highlight: boolean, numbers: number[]) => { },
        selected: (betType: string, numbers: number[]) => { }
    }

    onLoad() {
        this.initGroupBetItems();
        this.rouletteNumbers = this.numberContainer.children.map(child => child.getComponent(RouletteNumber)).sort((a, b) => +a.node.name - +b.node.name);
        this.rouletteNumbers.forEach(number => {
            number.initCustomButton();
            number.callback.highlight = (highlight, number) => {
                const numbers = this.getNeighbours(number);
                this.internalHighlight(highlight, numbers);
            };
            number.callback.selected = (number) => {
                const numbers = this.getNeighbours(number);
                this.internalHighlight(RouletteBetType.Direct, numbers);
            }
        });
    }

    getNeighbours(number: number) {
        const array = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        const centerIndex = array.findIndex(n => n === number);
        const padding = 2;
        const neighbors = [];
        for (let i = centerIndex - padding; i <= centerIndex + padding; i++) {
            let index = (i + array.length) % array.length;
            neighbors.push(array[index]);
        }
        return neighbors;
    }

    internalHighlight(highlight, numbers) {
        if (highlight) {
            this.highlightNumbers(numbers);
        } else {
            this.clearHighlight();
        }

        this.callback.highlight(highlight, numbers);
    }

    internalSelected(betType: string, numbers: number[]) {
        this.callback.selected(betType, numbers);
    }

    initGroupBetItems() {
        this.groupItems = this.groupItemNode.children.map(child => child.getComponent(RouletteGroupBetItem));
        this.groupItems.forEach(item => {
            item.groupBetItemCallback.highlight = (highlight, numbers) => {
                this.internalHighlight(highlight, numbers);
            };
            item.groupBetItemCallback.selected = (betType, numbers) => {
                this.internalSelected(betType, numbers);
            };
        });
    }

    highlightNumbers(numbers: number[]) {
        this.clearHighlight();
        numbers.forEach(i => {
            this.rouletteNumbers[i].showHighlight();
        });
    }

    clearHighlight() {
        this.rouletteNumbers.forEach(number => { number.clear(); });
    }
}
