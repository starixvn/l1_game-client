import GameBaseFinishHandler from "../../../_base/handlers/GameBaseFinishHandler";
import BauCua from "../BauCua";

export default class BauCuaFinishHandler extends GameBaseFinishHandler {
    constructor(protected readonly main: BauCua) {
        super(main, 2.5);
    }

    handleFinishData(dataFinish, onFinishHandlingData: () => void = null) {
        super.handleFinishData(dataFinish, onFinishHandlingData);
       
    }
}
