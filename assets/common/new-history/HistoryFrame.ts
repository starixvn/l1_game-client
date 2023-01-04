import PaginationCommon from "../helpers/Pagination/PaginationCommon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HistoryFrame extends cc.Component {
    @property(cc.Node)
    tableBg: cc.Node = null;

    @property(PaginationCommon)
    pagination: PaginationCommon = null;

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

    private PADDING_HEIGHT = 12;
    private PADDING_TOP_HEIGHT = 60;

    private backFrameLayout: cc.Layout;

    public clickCloseButton = () => {};

    onLoad() {
        this.gameName.node.active = false;
        this.backFrameLayout = this.mainFrame.getComponent(cc.Layout);
    }

    updateSizeFrame(widthContent: number, heightContent: number) {
        this.mainFrame.children.forEach((child) => {
            child.width = (widthContent + this.PADDING_HEIGHT * 2) / 2;
            child.height = heightContent + this.PADDING_HEIGHT + this.PADDING_TOP_HEIGHT;
        });
        this.tableBg.width = widthContent;
        this.tableBg.height = heightContent;
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
