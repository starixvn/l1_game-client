import BetItem from "../../_base/view-models/BetItem";
import Fantan from "./Fantan";
import AudioManager from "../../../common/audio/AudioManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class FantanBetOptionsUI extends cc.Component {
    @property(cc.Node)
    betContainer: cc.Node = null;

    betItems: BetItem[] = [];
    main: Fantan;

    start() {
        // Open the collision manager, without this part statement you will not detect any collision.
        cc.director.getCollisionManager().enabled = true;
    }

    initBetOptions(main: Fantan) {
        this.main = main;
        this.betContainer.getComponentsInChildren(BetItem).forEach((betItem) => {
            this.betItems.push(betItem);
        });
        main.betItems = this.betItems;
    }

    onBetClick(e: cc.Event.EventTouch) {
        this.main.isBetSound && AudioManager.getInstance().playClick();
        const location = e.getLocation();
        const betItem = this.betContainer.children.find((item) => {
            const collider = item.getComponent(cc.PolygonCollider);
            return this.checkCollider(location, collider);
        });

        if (!betItem) {
            return;
        }

        this.main.handleBetItemClick(betItem.name);
    }

    checkCollider(location, collider) {
        return cc.Intersection.pointInPolygon(location, collider.world.points);
    }
}
