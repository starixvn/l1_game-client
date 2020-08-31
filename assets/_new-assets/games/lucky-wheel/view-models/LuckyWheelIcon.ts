import DraggableItem from "../../../common/draggable-layout/view-models/DraggableItem";
import LuckyWheel from "./LuckyWheel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelIcon extends cc.Component {
    @property(cc.Prefab)
    luckyWheelPrefab: cc.Prefab = null;

    private isMove: boolean = false;
    private luckyWheelComponent: LuckyWheel;
    private main: any;

    init(main) {
        this.main = main;
    }

    onLoad() {
        const draggableItem = this.node.getComponent(DraggableItem);

        draggableItem.touchCallback.start = () => { this.isMove = false; }
        draggableItem.touchCallback.move = () => { this.isMove = true; }
        draggableItem.touchCallback.end = () => {
            if (!this.isMove) {
                this.openGame();
            }

            this.isMove = false;
        }
    }

    openGame() {
        if (!this.luckyWheelComponent) {
            const luckyWheelNode = cc.instantiate(this.luckyWheelPrefab);
            const luckyWheelComponent = luckyWheelNode.getComponent(LuckyWheel);
            this.main.node.addChild(luckyWheelNode);
            this.luckyWheelComponent = luckyWheelComponent;
        }
        this.luckyWheelComponent.showLuckyWheel();
    }
}
