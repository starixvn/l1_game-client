const { ccclass, property } = cc._decorator;

@ccclass
export default class SMPromotionPageView extends cc.Component {
    @property(cc.PageView)
    pageView: cc.PageView = null;

    @property(cc.Node)
    mainFrame: cc.Node = null;

    listPageNode: cc.Node[] = [];
    pageDelayTime = [];

    onLoad() {
        const commonDialog = this.mainFrame.getComponent("CommonDialog");
        commonDialog.onDidHide = () => {
            this.node.destroy();
        };

        if (cc.sys.isMobile) {
            this.mainFrame.y = this.mainFrame.y + 40;
        }
    }

    onEnable() {
        this.listPageNode = this.pageView.getPages();
        this.scrollToPage1();
    }

    scrollToPage1() {
        this.playAnimation(0);
    }

    scrollToPage2() {
        this.playAnimation(1);
    }

    scrollToPage3() {
        this.playAnimation(2);
    }

    playAnimation(pageIndex: number) {
        this.pageView.scrollToPage(pageIndex, 0.3);
        const animation = this.listPageNode[pageIndex].getComponent(cc.Animation);
        animation.play();
    }
}
