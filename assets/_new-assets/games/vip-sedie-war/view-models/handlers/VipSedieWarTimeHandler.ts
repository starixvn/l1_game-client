import VipSedieTimeHandler from "../../../vip-sedie/view-models/handlers/VipSedieTimeHandler";
import VipSedieWar from "../VipSedieWar";

export default class VipSedieWarTimeHandler extends VipSedieTimeHandler {
    constructor(readonly main: VipSedieWar) {
        super(main);
    }

    shakeThePlate() {
        cc.tween(this.main)
            .call(() => this.main.closePlate())
            .delay(0.5)
            .call(() => {
                cc.RedT.isSoundGame() && this.main.shakeThePlateAudio.play();
                this.main.dishes.forEach(dish => {
                    dish.shake();
                })
            })
            .start();
    }
}
