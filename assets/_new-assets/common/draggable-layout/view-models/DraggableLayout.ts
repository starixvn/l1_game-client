import DraggableItem from "./DraggableItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DraggableLayout extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    private emptySlotPosition = cc.v2(10000, 10000);
    private movingItem: cc.Node = null;
    private items: DraggableItem[] = [];
    private callback = {
        start: (node: cc.Node) => { this.onItemTouchStart(node); },
        move: (touchPosition: cc.Vec2) => { this.onItemTouchMove(touchPosition); },
        end: () => { this.onItemTouchEnd(); },
    }
    private readonly zIndexOffset = 100;

    onLoad() {
        this.content.children.forEach(child => {
            const item = child.getComponent(DraggableItem);
            item.touchCallback = this.callback;
            this.items.push(item);
        });
    }

    onItemTouchStart(node: cc.Node) {
        this.emptySlotPosition = node.position;
        this.movingItem = node;
        this.movingItem.zIndex += this.zIndexOffset;
    }

    onItemTouchMove(moveTouch: cc.Vec2) {
        const localPosition = this.movingItem.parent.convertToNodeSpaceAR(moveTouch);
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i].node;

            if (item != this.movingItem && item.getBoundingBox().contains(localPosition)) {
                const itemPosition = item.position;
                item.position = this.emptySlotPosition;
                this.emptySlotPosition = itemPosition;
                return;
            }
        }
    }

    onItemTouchEnd() {
        this.movingItem.position = this.emptySlotPosition;
        this.movingItem.zIndex -= this.zIndexOffset;

        this.emptySlotPosition = cc.v2(10000, 10000);
        this.movingItem = null;
    }
}
