const { ccclass, property } = cc._decorator;

@ccclass
export default class BalanceBetNotification extends cc.Component {

    @property
    text: string = 'Trả tiền cân cửa.';
}
