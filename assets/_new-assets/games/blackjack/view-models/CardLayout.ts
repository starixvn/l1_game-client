
const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CardLayout extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    shadow: cc.Node = null;

    @property
    movingOffsetX = 0;

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
    selectedPosZ = 80;
    public selectedRotationX = 10;
    _selected = false;

    onLoad() {
        if (CC_EDITOR) {
            this.content.on(cc.Node.EventType.CHILD_ADDED, this.updateLayout, this);
            this.content.on(cc.Node.EventType.CHILD_REMOVED, this.updateLayout, this);
            this.content.on(cc.Node.EventType.CHILD_REORDER, this.updateLayout, this);
            this.updateLayout();
        } else {
            this.content.removeAllChildren();
        }
    }

    updateLayout() {
        let width = 0;
        const halfCardSize = this.cardSizeWidth / 2;
        this.content.children.forEach((child, index) => {
            child.zIndex = index;
            child.x = halfCardSize + this.ratio * index * this.spacingX;
            width = child.x;
        });

        width += halfCardSize;
        this.content.width = width;
        this.shadow.width = width;
        this.shadow.scale = this.content.scale;
    }

    getNextPosition(): cc.Vec3 {
        let x = this.cardSizeWidth / 2 + this.ratio * (this.content.childrenCount - 1) * this.spacingX;
        let z = 0;
        if (this._selected) {
            x += this.movingOffsetX;
            z = this.selectedPosZ;
        }
        return cc.v3(x, 0, z);
    }

    changeCardView(selected: boolean) {
        this._selected = selected;
        if (selected) {
            this.content.children.forEach((child, index) => {
                child.is3DNode = true;
                cc.tween(child)
                    .delay(0.1 * (this.content.childrenCount - 1 - index))
                    .parallel(
                        cc.tween(child)
                            .by(0.3, { x: this.movingOffsetX }),
                        cc.tween(child)
                            .to(0.3, { rotationX: this.selectedRotationX, z: this.selectedPosZ })
                    )
                    .start();
            });
        } else {
            this.content.children.forEach((child, index) => {
                child.is3DNode = true;
                cc.tween(child)
                    .delay(0.1 * index)
                    .parallel(
                        cc.tween(child)
                            .by(0.3, { x: -this.movingOffsetX }),
                        cc.tween(child)
                            .to(0.3, { rotationX: 0, z: 0 })
                    )
                    .start();
            });
        }
    }
}
