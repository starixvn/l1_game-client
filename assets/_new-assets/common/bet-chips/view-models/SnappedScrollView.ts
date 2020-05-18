const { ccclass, property } = cc._decorator;

@ccclass
export default class SnappedScrollView extends cc.Component {
    @property
    itemSize: number = 85;

    @property
    spacing: number = 8;

    public onScrollEnded = () => { };

    private calculatedPercent: number[] = [];
    private minDisplayIndex = 0;

    private scroll: cc.ScrollView;
    private scrollBegan = false;

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
        if (eventType == cc.ScrollView.EventType.SCROLL_ENDED) {
            if (!this.scrollBegan) {
                return;
            }
            this.scrollBegan = false;
            var percent = this.getPercent();
            for (var i = 0; i < this.calculatedPercent.length; i++) {
                var delta = percent - this.calculatedPercent[i];
                if (delta < 0) {
                    break;
                }
                if (this.calculatedPercent[i] == 1) {
                    break;
                }
                this.minDisplayIndex = i;
            }

            this.scrollTo(this.minDisplayIndex);
            this.onScrollEnded();
        }
        if (eventType == cc.ScrollView.EventType.SCROLL_BEGAN) {
            this.scrollBegan = true;
        }
    }

    scrollTo(index: number) {
        this.minDisplayIndex = index;
        this.scroll.scrollToPercentHorizontal(this.calculatedPercent[index], 0.3);
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
