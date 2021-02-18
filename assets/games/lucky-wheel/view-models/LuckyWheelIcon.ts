import SafeDraggableItem from '../../../common/draggable-layout/view-models/SafeDraggableItem';
import LuckyWheel from './LuckyWheel';

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckyWheelIcon extends SafeDraggableItem {
    @property(cc.Prefab)
    luckyWheelPrefab: cc.Prefab = null;

    private luckyWheelComponent: LuckyWheel;
    private mainNode: cc.Node;

    init(main: cc.Node) {
        this.mainNode = main;
    }

    onLoad() {
        super.onLoad();
        if (!cc.sys.isMobile) {
            this.node.scale = 0.75;
        }

        this.touchCallback.end = (isClicked) => {
            if (isClicked) {
                this.openGame();
            }
        };
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
