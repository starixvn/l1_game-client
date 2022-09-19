import EventEmitterBase from "../../../common/emitter/EventEmitterBase";

export class Settlement extends EventEmitterBase {
    static Events = {
        SHOW_STATUS: "Settlement:SHOW_STATUS",
        SHOW_RESULT: "Settlement:SHOW_RESULT",
        END_SHOW_RESULT: "Settlement:END_SHOW_RESULT",
        PAY_CHIP_ACTION: "Settlement:PAY_CHIP_ACTION"
    };
    settlement: any;
    status: any;

    showResult(settlement: any) {
        this.settlement = settlement;
        this.emit(Settlement.Events.SHOW_RESULT, this.settlement);
    }

    finishShowResult(settlement: any, animated: boolean) {
        const data = { settlement: settlement || this.settlement, animated };
        this.emit(Settlement.Events.END_SHOW_RESULT, data);
    }

    showStatus() {
        this.status && this.emit(Settlement.Events.SHOW_STATUS, this.status);
    }

    receiveStatus(status: any) {
        this.status = status;
    }

    clearStatus() {
        this.status = null;
    }

    clearSettlement() {
        this.settlement = null;
    }

    payChips(settlement: any) {
        this.emit(Settlement.Events.PAY_CHIP_ACTION, settlement);
    }
}
