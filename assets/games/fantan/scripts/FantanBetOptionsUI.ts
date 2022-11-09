import BetItem from "../../_base/view-models/BetItem";
import Fantan from "./Fantan";
import AudioManager from "../../../common/audio/AudioManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class FantanBetOptionsUI extends cc.Component {
    @property(cc.Node)
    betContainer: cc.Node = null;

    private main: Fantan;

    start() {
        // Open the collision manager, without this part statement you will not detect any collision.
        cc.director.getCollisionManager().enabled = true;
    }

    initBetOptions(main: Fantan) {
        this.main = main;
        const betItems: BetItem[] = [];
        this.betContainer.getComponentsInChildren(BetItem).forEach((betItem) => {
            betItems.push(betItem);
        });
        main.betItems = betItems;
    }

    onBetClick(e: cc.Event.EventTouch) {
        this.main.isBetSound && AudioManager.getInstance().playClick();
        const location = e.getLocation();
        const betItem = this.betContainer.children.find((item) => this.checkCollider(location, item.getComponent(cc.PolygonCollider)));

        if (!betItem) {
            return;
        }

        this.main.handleBetItemClick(betItem.name);
    }

    checkCollider(location: cc.Vec2, collider: cc.PolygonCollider) {
        return cc.Intersection.pointInPolygon(location, collider.world.points);
    }
}
