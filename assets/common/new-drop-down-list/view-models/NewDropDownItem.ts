import NewDropDownOption from "./NewDropDownOption";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewDropDownItem extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    option: NewDropDownOption;

    setData(option: NewDropDownOption) {
        this.option = option;
        this.label.string = option.text;
    }
}
