import FantanBowlAnimation from "../../scripts/FantanBowlAnimation";
import _ = require("lodash");

const { ccclass, property } = cc._decorator;

@ccclass
export default class Demo extends cc.Component {
    @property(FantanBowlAnimation)
    animation: FantanBowlAnimation = null;

    Restart() {
        this.animation.restart();
    }

    StartRound() {
        this.animation.startRound();
    }

    CloseRound() {
        this.animation.setNumberOfSeed(_.random(29, 40));
        this.animation.closeRound();
    }
}
