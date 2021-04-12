import { LotteryChoiceItem } from "./LotteryChoiceItem";

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class LotteryChoicesBoard extends cc.Component {
    abstract getChoices(): string[];

    public items: LotteryChoiceItem[] = [];
    protected highlighted = false;
    protected showedOwnBet = false;
    choiceBoardChanged = (name: string, selected: boolean) => {};

    unCheck() {
        this.items.forEach((item) => item.unCheck());
    }

    resetBoard() {
        this.unCheck();
        this.unlockSelection();
    }

    resetScrolling() {}

    initCallbackForItems() {
        this.items.forEach((item) => {
            item.choiceItemChanged = (name: string, selected: boolean) => {
                this.choiceBoardChanged(name, selected);
            };
        });
    }

    getSelectedItems(): string[] {
        const result = [];
        this.items.forEach((item) => {
            if (item.isChecked()) {
                result.push(item.node.name);
            }
        });
        return result;
    }

    lockSelection() {
        this.items.forEach((item) => {
            if (!item.isChecked()) {
                item.toggle.interactable = false;
            }
        });
    }

    hideStatistics() {
        this.items.forEach((item) => item.hideStatistics());
    }

    unlockSelection() {
        this.items.forEach((item) => {
            item.toggle.interactable = true;
        });
    }

    showHighlight(highlight: boolean) {
        this.highlighted = highlight;
    }

    setHighlightResult(values: string[]) {
        if (this.highlighted) {
            this.items.forEach((item) => {
                item.setHighlight(values.findIndex((value) => value === item.node.name) !== -1);
            });
        }
    }

    clearHighlight() {
        this.highlighted = false;
        this.items.forEach((item) => item.setHighlight(false));
    }

    clearOwnBet() {
        this.items.forEach((item) => item.clearOwnBet());
    }

    setOwnBet(values: any) {
        this.clearOwnBet();
        Object.keys(values).forEach((key) => {
            const item = this.items.find((i) => i.node.name === key);
            if (item) {
                item.setOwnBet(values[key]);
            }
        });
    }
}
