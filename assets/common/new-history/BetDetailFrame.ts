const { ccclass, property } = cc._decorator;

@ccclass
export default class BetDetailFrame extends cc.Component {
    @property(cc.Node)
    closeBtn: cc.Node = null;

    @property(cc.Node)
    backWrapper: cc.Node = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    @property(cc.Label)
    gameName: cc.Label = null;

    @property(cc.Node)
    titleBgNode: cc.Node = null;

    @property(cc.Layout)
    title: cc.Layout = null;

    private backFrameLayout: cc.Layout;

    public clickCloseButton = () => {};

    onLoad() {
        this.gameName.node.active = false;
        this.backFrameLayout = this.mainFrame.getComponent(cc.Layout);
    }

    // setGameName(gameId: number) {
    //     const dataId = `gameNames.${gameId}`;
    //     const gameName = ` - ${i18n.t(dataId)}`;
    //     this.gameName.string = gameName.toUpperCase();
    //     this.gameName.node.active = true;
    // }

    updateSizeFrame(widthContent: number, heightContent: number) {
        this.mainFrame.children.forEach((child) => {
            child.width = widthContent / 2;
            child.height = heightContent;
        });
        this.backFrameLayout.updateLayout();
        this.backWrapper.width = this.mainFrame.width;
    }

    updateTitleSize(width: number) {
        this.titleBgNode.children.forEach((child) => {
            child.width = width / 2;
        });
        this.titleBgNode.getComponent(cc.Layout).updateLayout();
    }

    closePopup() {
        this.clickCloseButton();
    }
}
