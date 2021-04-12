import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class LotteryChoiceItem extends cc.Component {
    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.Label)
    statsLabel: cc.Label = null;

    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Label)
    ownBet: cc.Label = null;

    abstract setStats(number: number);
    abstract hideStatistics();
    choiceItemChanged = (name: string, selected: boolean) => {};

    unCheck() {
        this.toggle.isChecked = false;
    }

    isChecked() {
        return this.toggle.isChecked;
    }

    onLoad() {
        this.toggle.node.on("toggle", this.onToggleChanged, this);
    }

    onToggleChanged() {
        this.choiceItemChanged(this.node.name, this.toggle.isChecked);
    }

    setHighlight(show: boolean) {
        this.highlight.active = show;
    }

    setOwnBet(value: number) {
        if (this.label) {
            this.label.node.color = cc.Color.GREEN;
        }
        this.ownBet.string = numberWithCommas(value);
        this.ownBet.node.parent.active = true;
    }

    markOwnBet() {
        if (this.label) {
            this.label.node.color = cc.Color.GREEN;
        }
    }

    clearOwnBet() {
        if (this.label) {
            this.label.node.color = cc.Color.WHITE;
        }
        this.ownBet.node.parent.active = false;
    }
}
