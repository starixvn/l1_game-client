const { ccclass, property } = cc._decorator;

@ccclass
export default class SicBoOddsItem extends cc.Component {

    @property(cc.Label)
    odds: cc.Label = null;


    setValue(value: string) {
        this.odds.string = `1:${value}`;
    }
}
