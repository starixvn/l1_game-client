const { ccclass, property } = cc._decorator;

@ccclass
export default class DropDownItem extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    @property
    value = "";
}
