const { ccclass, property } = cc._decorator;

@ccclass
export default class UmWarning extends cc.Component {
    @property(cc.Label)
    message: cc.Label = null;

    show(data: any) {
        if (data && data.um_message) {
            this.message.string = data.um_message;
        }

        this.node.active = true;
    }
}
