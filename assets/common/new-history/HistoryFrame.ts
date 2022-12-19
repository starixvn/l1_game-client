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
    mainFrame: cc.Node = null;

    @property(cc.Node)
    backFrame: cc.Node = null;

    private PADDING_HEIGHT = 12;
    private PADDING_TOP_HEIGHT = 60;

    private backFrameLayout: cc.Layout;

    public clickCloseButton = () => {};

    onLoad() {
        this.backFrameLayout = this.backFrame.getComponent(cc.Layout);
    }

    updateSizeFrame(widthContent: number, heightContent: number) {
        this.backFrame.children.forEach((child) => {
            child.width = (widthContent + this.PADDING_HEIGHT * 2) / 2;
            child.height = heightContent + this.PADDING_HEIGHT + this.PADDING_TOP_HEIGHT;
        });
        this.tableBg.width = widthContent;
        this.tableBg.height = heightContent;
        this.backFrameLayout.updateLayout();
        this.mainFrame.width = this.backFrame.width;
    }

    closePopup() {
        this.clickCloseButton();
    }
}
