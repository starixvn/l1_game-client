import PaginationCommon from "../helpers/Pagination/PaginationCommon";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HistoryFrame extends cc.Component {
    @property(cc.Node)
    mainLeftBg: cc.Node = null;

    @property(cc.Node)
    mainRightBg: cc.Node = null;

    @property(cc.Node)
    tableBg: cc.Node = null;

    @property(PaginationCommon)
    pagination: PaginationCommon = null;

    @property(cc.Node)
    closeBtn: cc.Node = null;

    private PADDING_HEIGHT = 12;
    private PADDING_TOP_HEIGHT = 60;

    public clickCloseButton = () => {};

    updateSizeFrame(widthContent: number, heightContent: number) {
        this.mainLeftBg.width = this.mainRightBg.width = (widthContent + this.PADDING_HEIGHT * 2) / 2;
        this.mainLeftBg.height = this.mainRightBg.height = heightContent + this.PADDING_HEIGHT + this.PADDING_TOP_HEIGHT;
        this.tableBg.width = widthContent;
        this.tableBg.height = heightContent;
        this.node.getChildByName("main").getComponent(cc.Layout).updateLayout();
    }

    closePopup() {
        this.clickCloseButton();
    }
}
