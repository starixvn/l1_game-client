import { LotteryChoiceItem } from "./LotteryChoiceItem";

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class LotteryChoicesBoard extends cc.Component {
    abstract getChoices(): string[];

    protected items: LotteryChoiceItem[] = [];
    protected highlighted = false;
    choiceBoardChanged = (name: string, selected: boolean) => {};

    unCheck() {
        this.items.forEach((item) => item.unCheck());
    }

    resetBoard() {
        this.unCheck();
    }

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
}
