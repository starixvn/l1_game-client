import RongHo from "../RongHo";
import DataHandler from "../../../../common/game/handlers/DataHandler";


export default class RHFinishDataHandler implements DataHandler {

    constructor(private readonly main: RongHo) {
    }

    handle(data: any): boolean {
        if (data.finish) {
            this.main.phienId = data.finish.round;
            this.main.logs.unshift(data.finish);
            this.main.logs.length > 100 && this.main.logs.pop();
            this.main.resultCards = data.finish.result;
            this.main.currentTimeRemaining = this.main.config.betTime + this.main.config.waitTime;
            if (cc.RedT.GAME_IS_SHOWED) {
                this.main.playAnimationResult();
                this.main.playTime();
            }
        }
        return true;
    }
}
