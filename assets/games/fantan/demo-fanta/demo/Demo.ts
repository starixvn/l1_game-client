import FantanBowlAnimation from "../../scripts/FantanBowlAnimation";
import _ = require("lodash");

const { ccclass, property } = cc._decorator;

@ccclass
export default class Demo extends cc.Component {
    @property(FantanBowlAnimation)
    animation: FantanBowlAnimation = null;

    Restart() {
        this.animation.Restart();
    }

    StartRound() {
        this.animation.StartRound();
    }

    CloseRound() {
        this.animation.SetNumberOfSeed(_.random(29, 40));
        this.animation.CloseRound();
    }
}
