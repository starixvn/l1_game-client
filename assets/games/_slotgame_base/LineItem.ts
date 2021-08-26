const { ccclass, property } = cc._decorator;

@ccclass
export default class LineItem extends cc.Component {
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    @property(cc.Label)
    num: cc.Label = null;

    @property(cc.Color)
    highlightLabelColor: cc.Color = cc.color(255, 198, 0);

    @property(cc.Color)
    normalLabelColor: cc.Color = cc.color(126, 97, 0);

    setChecked(checked: boolean) {
        this.toggle.isChecked = checked;
        this.updateDisplay();
    }

    onStatusChanged() {
        cc.RedT.audio.playClick();

        this.updateDisplay();
    }

    updateDisplay() {
        const highlight = this.toggle.isChecked;
        this.icon.node.color = highlight ? cc.Color.WHITE : cc.Color.GRAY;
        this.num.node.color = highlight ? this.highlightLabelColor : this.normalLabelColor;
    }
}
