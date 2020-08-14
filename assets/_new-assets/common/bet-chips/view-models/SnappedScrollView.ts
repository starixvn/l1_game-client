const { ccclass, property } = cc._decorator;

@ccclass
export default class SnappedScrollView extends cc.Component {
    @property
    itemSize: number = 85;

    @property
    spacing: number = 8;

    @property
    enableHalfSpacing: boolean = true;

    public onScrollEnded = () => { };

    private calculatedPercent: number[] = [];
    private minDisplayIndex = 0;

    private scroll: cc.ScrollView;
    private scrollBegan = false;

    onLoad() {
        this.scroll = this.getComponent(cc.ScrollView);
        const count = this.scroll.content.childrenCount;
        const contentWidth = count * this.itemSize + (count + 1) * this.spacing;
        const maxOffset = contentWidth - this.scroll.node.width;// this.scroll.getMaxScrollOffset().x;
        const haftSpacing = this.spacing / 2;
        for (var i = 0; i < count; i++) {
            let offset = (this.itemSize + this.spacing) * i + (this.enableHalfSpacing ? haftSpacing : 0);
            if (offset > maxOffset) {
                offset = maxOffset;
            }

            const percent = offset / maxOffset;
            this.calculatedPercent.push(percent);
        }
    }

    onScroll(scroll: cc.ScrollView, eventType) {
        if (eventType == cc.ScrollView.EventType.SCROLL_ENDED) {
            if (!this.scrollBegan) {
                return;
            }
            this.scrollBegan = false;
            var percent = this.getPercent();
            this.calculateMinDisplayIndex(percent);

            this.scrollTo(this.minDisplayIndex);
            this.onScrollEnded();
        }
        if (eventType == cc.ScrollView.EventType.SCROLL_BEGAN) {
            this.scrollBegan = true;
        }
    }

    calculateMinDisplayIndex(percent: number) {
        for (let i = 0; i < this.calculatedPercent.length; i++) {
            if (this.calculatedPercent[i] <= percent && percent <= this.calculatedPercent[i + 1]) {
                const delta1 = percent - this.calculatedPercent[i];
                const delta2 = this.calculatedPercent[i + 1] - percent;
                delta1 + delta2 > 0 && (this.minDisplayIndex = (delta1 < delta2) ? i : i + 1);
            }

            if (percent < this.calculatedPercent[i]) {
                this.minDisplayIndex = i;
                break;
            }
            if (this.calculatedPercent[i] >= 1) {
                break;
            }
        }
    }

    scrollTo(index: number) {
        this.minDisplayIndex = index;
        this.scroll.scrollToPercentHorizontal(this.calculatedPercent[index], 0.3);
    }

    getPercent(): number {
        var offset = -this.scroll.getScrollOffset().x;
        if (offset < 0) {
            return 0;
        }
        var percent = offset / this.scroll.getMaxScrollOffset().x;
        if (percent > 1) {
            return 1;
        }
        return percent;
    }

    getMinDisplayIndex(): number {
        return this.minDisplayIndex;
    }
}
