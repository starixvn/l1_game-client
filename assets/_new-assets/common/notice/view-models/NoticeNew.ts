const { ccclass, property } = cc._decorator;

@ccclass
export default class NoticeNew extends cc.Component {
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

    onLoad() {
        this.handleClickButton = () => { this.close() };
    }

    onEnable() {
        this.node.runAction(cc.spawn(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()), cc.fadeTo(0.5, 255)));
    }

    onDisable() {
        this.node.destroyAllChildren();
        this.node.destroy();
    }

    public setTitle(title: string) {
        this.title.string = title;
    }

    public setMessage(message: string) {
        this.message.string = message;
    }

    public setButtonLabel(buttonText: string) {
        this.buttonLabel.string = buttonText;
    }

    public hideButton() {
        this.buttonNode.active = false;
    }

    public onClickButton() {
        cc.RedT.audio.playClick();

        this.handleClickButton();
    }

    public close() {
        this.node.active = false;
    }

    // update (dt) {}
}
