import DraggableItem from '../../../common/draggable-layout/view-models/DraggableItem';
const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelIcon extends cc.Component {

    ttOffset2: cc.Vec2 = cc.v2(0, 0);
    isMove: boolean = false;

    public handleOpenGame = () => { };

    onLoad() {
        const dragableItem = this.getComponent(DraggableItem);

        dragableItem.touchCallback.start = (node) => {
            this.isMove = false;
        }
        dragableItem.touchCallback.move = (touchPosition) => {
            this.isMove = true;
        }
        dragableItem.touchCallback.end = () => {
            if (!this.isMove) {
                this.openGame();
            }
        }
    }

    openGame() {
        this.handleOpenGame();
    }
}
