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

    abstract setStats(number: number);
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
}
