import _ = require("lodash");

const { ccclass, property } = cc._decorator;

@ccclass
export default class RandonWaitingMessage extends cc.Component {
    @property(cc.Label)
    listMessage: cc.Label[] = [];

    @property(cc.Node)
    messageContainer: cc.Node = null;

    private firstMessage: cc.Label = null;
    private secondMessage: cc.Label = null;
    private readonly animationDuration = 2;
    private readonly displayMessageTime = 4;
    private moveY = 35;

    onLoad() {
        this.listMessage.forEach((msg) => {
            msg.node.active = false;
        });
        this.firstMessage = this.listMessage[_.random(0, 1, false)];
        this.secondMessage = this.listMessage.find((msg) => msg != this.firstMessage);
        this.loadMessages();
    }

    loadMessages() {
        cc.tween(this)
            .call(() => {
                this.showMessage(this.firstMessage.node, 0);
            })
            .delay(this.displayMessageTime)
            .call(() => {
                this.hideMessage(this.firstMessage.node, this.animationDuration);
            })
            .delay(this.animationDuration)
            .call(() => {
                this.showMessage(this.secondMessage.node, this.animationDuration);
            })
            .start();
    }

    showMessage(msgNode: cc.Node, duration: number) {
        msgNode.active = true;
        msgNode.y = -this.moveY;
        msgNode.opacity = 0;
        cc.tween(msgNode)
            .to(duration, { position: cc.v3(0, 0, 0), opacity: 255 }, { easing: "sineIn" })
            .start();
    }

    hideMessage(msgNode: cc.Node, duration: number) {
        msgNode.active = true;
        cc.tween(msgNode)
            .to(duration, { position: cc.v3(0, this.moveY, 0), opacity: 0 }, { easing: "sineOut" })
            .start();
    }

    hideMessageList() {
        this.messageContainer.active = false;
    }

    setErrorMessage(message: string) {
        this.node.getComponent(cc.Label).string = message;
    }
}
