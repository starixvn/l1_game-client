import DraggableItem from "../../../common/draggable-layout/view-models/DraggableItem";
import LuckyWheel from "./LuckyWheel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelIcon extends cc.Component {
    @property(cc.Prefab)
    luckyWheelPrefab: cc.Prefab = null;

    private luckyWheelComponent: LuckyWheel;
    private mainNode: cc.Node;

    init(main: cc.Node) {
        this.mainNode = main;
    }

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.75;
        }

        const draggableItem = this.node.getComponent(DraggableItem);
        draggableItem.touchCallback.end = (isClicked) => {
            this.moveToEdge();
            if (isClicked) {
                this.openGame();
            }
        };
    }

    moveToEdge() {
        const width = this.node.parent.width;
        const height = this.node.parent.height;
        const fixTopPadding = 100;
        const maxX = width / 2 - this.node.width / 2;
        const maxY = height / 2 - this.node.height / 2;
        const deltaWidth = maxX - Math.abs(this.node.x);
        const deltaHeight = maxY - Math.abs(this.node.y);

        let posX, posY;
        if (deltaWidth < deltaHeight) {
            posY = this.node.y;
            posY = Math.min(maxY, posY);
            posY = Math.max(-maxY, posY);
            posX = this.node.x < 0 ? -maxX : maxX;
        } else {
            posX = this.node.x;
            posX = Math.min(maxX, posX);
            posX = Math.max(-maxX, posX);
            posY = this.node.y < 0 ? -maxY : maxY;
        }

        posY = Math.min(maxY - fixTopPadding, posY);

        this.node.runAction(cc.moveTo(0.3, posX, posY).easing(cc.easeSineOut()));
    }

    openGame() {
        if (!this.luckyWheelComponent) {
            const luckyWheelNode = cc.instantiate(this.luckyWheelPrefab);
            const luckyWheelComponent = luckyWheelNode.getComponent(LuckyWheel);
            this.mainNode.addChild(luckyWheelNode);
            this.luckyWheelComponent = luckyWheelComponent;
        }
        this.luckyWheelComponent.showLuckyWheel();
    }
}
