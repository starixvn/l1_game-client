import SedieTimeHandler from "../../../xoc-xoc/view-models/handlers/SedieTimeHandler";

export default class VipSedieTimeHandler extends SedieTimeHandler {

    handleInLockBetTime() {
        super.handleInLockBetTime();
        this.main.betItems.forEach(item => item.setHighlight(false));
    }
}
