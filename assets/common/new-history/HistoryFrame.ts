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

    private readonly PADDING = 12;
    private readonly PADDING_TOP_HEIGHT = 60;
    protected readonly PADDING_AROUND_POPUP = 80;

    public clickCloseButton = () => {};

    onLoad() {
        this.gameName.node.active = false;
    }

    updateSizeFrame(widthContent: number, heightContent: number, autoScaleNodeWidth: number) {
        const mainFrameWidth = widthContent + this.PADDING * 2;
        const mainFrameHeight = heightContent + this.PADDING + this.PADDING_TOP_HEIGHT;
        this.mainFrame.children.forEach((child) => {
            child.width = mainFrameWidth / 2;
            child.height = mainFrameHeight;
        });
        this.tableBg.width = widthContent;
        this.tableBg.height = heightContent;
        this.backWrapper.width = mainFrameWidth;

        const padding = this.PADDING_AROUND_POPUP;
        const autoScaleNode = this.backWrapper.parent;
        autoScaleNode.width = autoScaleNodeWidth;
        if (this.backWrapper.width + padding > autoScaleNodeWidth) {
            autoScaleNode.width = this.backWrapper.width + padding;
        }
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
