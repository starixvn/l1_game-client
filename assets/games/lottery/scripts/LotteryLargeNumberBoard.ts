import LotterryNumberBoard from './LotteryNumberBoard';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryLargeNumberBoard extends LotterryNumberBoard {
    @property(cc.PageView)
    pageView: cc.PageView = null;

    initItems() {
        for (let i = 0; i < 100; i++) {
            const index = i < 50 ? 0 : 1;
            const content = this.pageView.content.children[index];
            this.addItem(content, i);
        }
    }

    resetBoard() {
        super.resetBoard();
        this.pageView.scrollToPage(0, 0);
    }

    scrollToRight() {
        this.pageView.scrollToPage(1, 0.3);
    }

    scrollToLeft() {
        this.pageView.scrollToPage(0, 0.3);
    }
}
