const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieRoundResultItem extends cc.Component {

    @property(cc.Label)
    value: cc.Label = null;

    public setValue(value: number) {
        this.value.string = value.toString();
    }
}
