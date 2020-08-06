const { ccclass, property } = cc._decorator;

@ccclass
export default class RouletteTicketDetailItem extends cc.Component {

    @property(cc.Label)
    type: cc.Label = null;

    @property(cc.Label)
    choice: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    height: number = null;

    // onLoad() {
    //     this.updateContent();
    // }

    updateContent() {
        this.type.string = 'asds';
        this.choice.string = 'asds';
        this.amount.string = '000';
        this.height = this.node.height;
    }
}
