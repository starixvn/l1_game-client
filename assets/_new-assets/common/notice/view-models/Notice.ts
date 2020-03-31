const { ccclass, property } = cc._decorator;

@ccclass
export default class Notice extends cc.Component {
    @property(cc.Node)
    popupNode: cc.Node = null;

    @property(cc.Label)
    title: cc.Label = null;

    @property(cc.Label)
    message: cc.Label = null;

    @property(cc.Node)
    buttonNode: cc.Node = null;

    @property(cc.Label)
    buttonLabel: cc.Label = null;

    public handleClickButton: () => void;

    onEnable() {
        this.popupNode.opacity = 0;
        this.popupNode.scale = 0;
        this.popupNode.runAction(cc.spawn(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()), cc.fadeTo(0.5, 255)));
    }

    onDisable() {
        this.node.destroyAllChildren();
        this.node.destroy();
    }

    public init(data: any) {
        this.node.active = true;

        cc.RedT.inGame.loading.active = false;

        this.setTitle(data.title);
        this.setMessage(data.text);
        this.setButton(data.button);
    }

    public onClickButton() {
        cc.RedT.audio.playClick();

        if (this.handleClickButton) {
            this.handleClickButton();
        }
        this.close();
    }

    public close() {
        this.node.active = false;
    }

    public setTitle(title: string) {
        if (title) {
            this.title.string = title;
        }
        else {
            this.title.string = "Thông Báo"
        }
    }

    public setMessage(message: string) {
        if (message) {
            this.message.string = message;
        }
    }

    public setButton(button: any) {
        if (button) {
            this.message.node.y = 15;
            this.buttonLabel.string = button.text;
            this.buttonNode.active = true;
        } else {
            this.buttonNode.active = false;
        }
    }

    // update (dt) {}
}
