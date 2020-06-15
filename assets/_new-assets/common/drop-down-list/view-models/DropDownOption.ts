
const { ccclass, property } = cc._decorator;

@ccclass("DropDownOption")
export default class DropDownOption {
    constructor(value: string, text: string) {
        this.value = value;
        this.text = text;
    }

    @property(cc.String)
    value: string = "";

    @property(cc.String)
    text: string = "";
}
