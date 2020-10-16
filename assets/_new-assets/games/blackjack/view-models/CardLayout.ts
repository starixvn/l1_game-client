
const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CardLayout extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    shadow: cc.Node = null;

    @property
    scaleX = 1;

    @property
    scaleY = 0.8;

    @property
    _spacingX = 20;

    @property
    get spacingX() {
        return this._spacingX;
    }

    set spacingX(value) {
        this._spacingX = value;
        this.updateLayout();
    }

    @property
    _ratio = 0.9;

    @property
    get ratio() {
        return this._ratio;
    }

    set ratio(value) {
        this._ratio = value;
        this.updateLayout();
    }

    cardSizeWidth = 76;
    selectedPositionY = 30;
    _selected = false;

    get selectedScaleY() {
        return this.scaleY * 1.5;
    }

    onLoad() {
        if (CC_EDITOR) {
            this.content.on(cc.Node.EventType.CHILD_ADDED, this.updateLayout, this);
            this.content.on(cc.Node.EventType.CHILD_REMOVED, this.updateLayout, this);
            this.content.on(cc.Node.EventType.CHILD_REORDER, this.updateLayout, this);
        } else {
            this.content.removeAllChildren();
        }
    }

    updateLayout() {
        const half = this.content.childrenCount / 2;

        let width = 0;
        const halfCardSize = this.cardSizeWidth / 2;
        this.content.children.forEach((child, index) => {
            child.zIndex = index;
            child.x = halfCardSize + this.ratio * index * this.spacingX;
            // child.angle = (index - half) * 1;
            // child.y = Math.abs(index - half) * 0.45;

            child.angle = (index - half) * 1;
            // child.y = Math.abs(index - half) * 0.45;
            width = child.x;
            child.scaleX = this.scaleX;
            child.scaleY = this._selected ? this.selectedScaleY : this.scaleY;
        });

        width += halfCardSize;
        this.content.width = width;
        this.shadow.width = width;
        this.shadow.scale = this.content.scale;
    }

    getScaleY(): number {
        return this._selected ? this.selectedScaleY : this.scaleY;
    }

    getNextPosition(): cc.Vec2 {
        return cc.v2(this.cardSizeWidth / 2 + this.ratio * (this.content.childrenCount - 1) * this.spacingX, this._selected ? this.selectedPositionY : 0);
    }

    changeCardView(selected: boolean) {
        this._selected = selected;
        if (selected) {
            this.content.children.forEach((child, index) => {
                cc.tween(child)
                    .delay(0.1 * (this.content.childrenCount - 1 - index))
                    .parallel(
                        cc.tween(child)
                            .to(0.3, { position: cc.v2(child.x, this.selectedPositionY) }),
                        cc.tween(child)
                            .to(0.3, { scaleY: this.selectedScaleY })
                    )
                    .start();
            });
        } else {
            this.content.children.forEach((child, index) => {
                cc.tween(child)
                    .delay(0.1 * index)
                    .parallel(
                        cc.tween(child)
                            .to(0.3, { position: cc.v2(child.x, 0) }),
                        cc.tween(child)
                            .to(0.3, { scaleY: this.scaleY })
                    )
                    .start();
            });
        }
    }
}
