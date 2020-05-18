const { ccclass, property } = cc._decorator;

@ccclass
export default class SnappedScrollView extends cc.Component {
    @property
    itemSize: number = 85;

    @property
    spacing: number = 8;

    private calculatedPercent: number[] = [];
    private minDisplayIndex = 0;

    private scroll: cc.ScrollView;
    onLoad() {
        this.scroll = this.getComponent(cc.ScrollView);
        var count = this.scroll.content.childrenCount;
        var maxOffset = this.scroll.getMaxScrollOffset().x;
        for (var i = 0; i < count; i++) {
            var offset = (this.itemSize + this.spacing) * i;
            if (offset > maxOffset) {
                offset = maxOffset;
            }

            var percent = offset / maxOffset;
            this.calculatedPercent.push(percent);
        }
    }

    onScroll(scroll: cc.ScrollView, eventType) {
        if (eventType == 9) {
            var percent = this.getPercent();
            for (var i = 0; i < this.calculatedPercent.length; i++) {
                var delta = percent - this.calculatedPercent[i];
                if (delta < 0) {
                    break;
                }
                this.minDisplayIndex = i;
                if (this.calculatedPercent[i] == 1) {
                    break;
                }
            }

            this.scrollTo(this.minDisplayIndex);
        }
    }

    stopScroll() {
        this.scroll.stopAutoScroll();
    }

    scrollTo(index: number) {
        this.minDisplayIndex = index;
        this.scroll.scrollToPercentHorizontal(this.calculatedPercent[index], 0);
    }

    getPercent(): number {
        var offset = Math.abs(this.scroll.getScrollOffset().x);
        var percent = offset / this.scroll.getMaxScrollOffset().x;
        return percent;
    }

    getMinDisplayIndex(): number {
        return this.minDisplayIndex;
    }
}
