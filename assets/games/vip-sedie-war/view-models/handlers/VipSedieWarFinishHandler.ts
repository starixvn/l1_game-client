import SedieFinishHandler from "../../../sedie/view-models/handlers/SedieFinishHandler";
import VipSedieWar from "../VipSedieWar";

export default class VipSedieWarFinishHandler extends SedieFinishHandler {
    constructor(protected readonly main: VipSedieWar) {
        super(main);
    }

    handleFinishData(dataFinish, onFinishHandlingData: () => void = null) {
        this.main.currentDataLogs.unshift(dataFinish);
        this.main.currentDataLogs.length > 100 && this.main.currentDataLogs.pop();
        this.main.setDotsResult();
        cc.tween(this.main)
            .call(() => this.main.openPlate(true))
            .delay(1)
            .call(() => {
                this.main.showResultOnTable();
                onFinishHandlingData();
            })
            .start();
    }
}
